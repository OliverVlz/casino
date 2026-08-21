import { createHash } from 'node:crypto'

import {
  siteSnapshotSchema,
  type ContentBlock,
  type SiteSnapshot,
  type SnapshotCasino,
  type SnapshotOffer,
  type SnapshotPage,
} from '@casino/contracts'
import type { Payload } from 'payload'

import type {
  Casino,
  Locale,
  Market,
  Media,
  Offer,
  Page,
  Redirect,
} from '@/payload-types'

type SupportedLocale = 'es-CO' | 'en-CA' | 'fr-CA'

type BuildSiteSnapshotOptions = {
  draft?: boolean
  locale?: SupportedLocale
  pageId?: number | string
  siteKey: string
}

const stableSerialize = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
    return `{${entries.join(',')}}`
  }

  return JSON.stringify(value)
}

const checksumFor = (snapshot: Omit<SiteSnapshot, 'checksum'>): string =>
  createHash('sha256').update(stableSerialize(snapshot)).digest('hex')

const relationDocument = <T extends { id: number }>(value: number | T | null | undefined, label: string): T => {
  if (value && typeof value === 'object') return value
  throw new Error(`La relación ${label} no fue cargada con suficiente profundidad.`)
}

const isoDate = (value: string): string => new Date(value).toISOString()

type LexicalNode = {
  children?: LexicalNode[]
  text?: string
}

const lexicalNodeText = (node: LexicalNode): string => {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(lexicalNodeText).join('')
}

const lexicalParagraphs = (value: unknown): string[] => {
  const root =
    value && typeof value === 'object' && 'root' in value
      ? (value.root as { children?: unknown[] })
      : undefined
  const children = root && Array.isArray(root.children) ? (root.children as LexicalNode[]) : []
  const paragraphs = children.map(lexicalNodeText).map((text) => text.trim()).filter(Boolean)

  if (paragraphs.length === 0) {
    throw new Error('Una sección editorial publicada no contiene párrafos visibles.')
  }

  return paragraphs
}

const localePath = (locale: SupportedLocale): string => {
  if (locale === 'es-CO') return '/es'
  if (locale === 'en-CA') return '/en'
  return '/fr'
}

const canonicalFor = (domain: string, locale: SupportedLocale, route: string): string => {
  const origin = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`
  const path = `${localePath(locale)}${route === '/' ? '' : route}`
  return new URL(path, origin).toString()
}

const buildBlocks = (page: Page, casinosById: Map<number, Casino>): ContentBlock[] =>
  page.layout.map((block): ContentBlock => {
    switch (block.blockType) {
      case 'hero':
        return {
          blockType: 'hero',
          eyebrow: block.eyebrow,
          heading: block.heading,
          summary: block.summary,
          primaryActionLabel: block.primaryActionLabel,
          primaryActionHref: block.primaryActionHref,
        }
      case 'casinoList':
        return {
          blockType: 'casinoList',
          heading: block.heading,
          intro: block.intro,
          casinoSlugs: block.casinos.map((casino) => {
            const document = typeof casino === 'number' ? casinosById.get(casino) : casino
            if (!document) throw new Error('El listado contiene un casino que no está disponible para el sitio.')
            return document.slug
          }),
        }
      case 'copy':
        return {
          blockType: 'copy',
          heading: block.heading,
          body: lexicalParagraphs(block.body),
          sources: (block.sources ?? []).map((source) => ({
            label: source.label,
            publisher: source.publisher,
            url: source.url,
            reviewedAt: isoDate(source.reviewedAt),
          })),
        }
      case 'faq':
        return {
          blockType: 'faq',
          heading: block.heading,
          items: block.items.map((item) => ({
            question: item.question,
            answer: item.answer,
            sources: (item.sources ?? []).flatMap((source) =>
              source.publisher && source.reviewedAt
                ? [
                    {
                      label: source.label,
                      publisher: source.publisher,
                      url: source.url,
                      reviewedAt: isoDate(source.reviewedAt),
                    },
                  ]
                : [],
            ),
          })),
        }
      case 'responsibleGaming':
        return {
          blockType: 'responsibleGaming',
          heading: block.heading,
          body: block.body,
          resources: block.resources.map((resource) => ({
            label: resource.label,
            url: resource.url,
          })),
        }
    }
  })

const mediaPath = (logo: Casino['logo']): string | undefined => {
  if (!logo || typeof logo === 'number') return undefined
  const media = logo as Media
  return media.url?.startsWith('/') ? media.url : undefined
}

const latestTimestamp = (documents: { updatedAt?: string }[]): string => {
  const timestamps = documents
    .map((document) => document.updatedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter(Number.isFinite)

  return new Date(timestamps.length ? Math.max(...timestamps) : Date.now()).toISOString()
}

export async function buildSiteSnapshot(
  payload: Payload,
  { draft = false, locale, pageId, siteKey }: BuildSiteSnapshotOptions,
): Promise<SiteSnapshot> {
  const siteResult = await payload.find({
    collection: 'sites',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: { key: { equals: siteKey } },
  })
  const site = siteResult.docs[0]
  if (!site) throw new Error(`No existe el sitio ${siteKey}.`)

  const market = relationDocument<Market>(site.market, 'site.market')
  const defaultLocaleDocument = relationDocument<Locale>(site.defaultLocale, 'site.defaultLocale')
  const supportedLocaleDocuments = site.supportedLocales.map((item) =>
    relationDocument<Locale>(item, 'site.supportedLocales'),
  )
  const localeCodes = supportedLocaleDocuments.map((item) => item.code as SupportedLocale)
  const requestedLocales = locale ? [locale] : localeCodes
  const contentLocale = (locale ?? defaultLocaleDocument.code) as SupportedLocale

  if (!localeCodes.includes(contentLocale)) {
    throw new Error(`El locale ${contentLocale} no está habilitado para ${siteKey}.`)
  }

  const tenantFilter = { tenant: { equals: site.id } }
  const casinoResult = await payload.find({
    collection: 'casinos',
    depth: 2,
    draft,
    fallbackLocale: false,
    limit: 100,
    locale: contentLocale,
    overrideAccess: true,
    sort: 'createdAt',
    where: tenantFilter,
  })
  const casinosById = new Map(casinoResult.docs.map((casino) => [casino.id, casino]))

  const pages: SnapshotPage[] = []
  const pageDocuments: Page[] = []
  for (const pageLocale of requestedLocales) {
    const pageWhere = pageId
      ? { and: [tenantFilter, { id: { equals: pageId } }] }
      : tenantFilter
    const pageResult = await payload.find({
      collection: 'pages',
      depth: 2,
      draft,
      fallbackLocale: false,
      limit: 100,
      locale: pageLocale,
      overrideAccess: true,
      sort: 'route',
      where: pageWhere,
    })

    for (const page of pageResult.docs) {
      pageDocuments.push(page)
      pages.push({
        id: String(page.id),
        locale: pageLocale,
        route: page.route,
        title: page.title,
        description: page.description,
        canonicalUrl: canonicalFor(site.domain, pageLocale, page.route),
        ...(page.equivalentGroup ? { equivalentGroup: page.equivalentGroup } : {}),
        updatedAt: isoDate(page.updatedAt),
        reviewedAt: isoDate(page.reviewedAt),
        author: { name: page.author.name, role: page.author.role },
        blocks: buildBlocks(page, casinosById),
      })
    }
  }

  if (pages.length === 0) {
    throw new Error(`No hay páginas ${draft ? 'en borrador' : 'publicadas'} para ${siteKey}.`)
  }

  const offerResult = await payload.find({
    collection: 'offers',
    depth: 2,
    draft,
    fallbackLocale: false,
    limit: 100,
    locale: contentLocale,
    overrideAccess: true,
    sort: 'createdAt',
    where: { and: [tenantFilter, { enabled: { equals: true } }] },
  })
  const redirectResult = await payload.find({
    collection: 'redirects',
    depth: 1,
    limit: 100,
    overrideAccess: true,
    where: tenantFilter,
  })
  const policyResult = await payload.find({
    collection: 'jurisdiction-policies',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    sort: '-effectiveFrom',
    where: tenantFilter,
  })
  const policy = policyResult.docs[0]
  if (!policy) throw new Error(`No existe una política jurisdiccional para ${siteKey}.`)

  const casinos: SnapshotCasino[] = casinoResult.docs.map((casino: Casino) => ({
    slug: casino.slug,
    name: casino.name,
    summary: casino.summary,
    licenseLabel: casino.licenseLabel,
    licenseUrl: casino.licenseUrl,
    verifiedAt: isoDate(casino.verifiedAt),
    ...(typeof casino.rating === 'number' ? { rating: casino.rating } : {}),
    highlights: (casino.highlights ?? []).map((highlight) => highlight.label),
    ...(mediaPath(casino.logo) ? { logoPath: mediaPath(casino.logo) } : {}),
  }))
  const offers: SnapshotOffer[] = offerResult.docs.map((offer: Offer) => {
    const casino = relationDocument<Casino>(offer.casino, 'offer.casino')
    return {
      slug: offer.slug,
      casinoSlug: casino.slug,
      label: offer.label,
      destinationUrl: offer.destinationUrl,
      termsSummary: offer.termsSummary,
      validFrom: isoDate(offer.validFrom),
      ...(offer.validUntil ? { validUntil: isoDate(offer.validUntil) } : {}),
    }
  })

  const generatedAt = latestTimestamp([
    site,
    policy,
    ...pageDocuments,
    ...casinoResult.docs,
    ...offerResult.docs,
    ...redirectResult.docs,
  ])
  const snapshotWithoutChecksum: Omit<SiteSnapshot, 'checksum'> = {
    schemaVersion: 1,
    snapshotVersion: Math.max(1, Math.floor(Date.parse(generatedAt) / 1000)),
    siteKey: site.key,
    generatedAt,
    site: {
      name: site.theme.brandName,
      domain: site.domain,
      marketCode: market.code,
      defaultLocale: defaultLocaleDocument.code as SupportedLocale,
      locales: localeCodes,
    },
    policy: {
      jurisdiction: policy.jurisdiction,
      minimumAge: policy.minimumAge,
      effectiveFrom: isoDate(policy.effectiveFrom),
      reviewedAt: isoDate(policy.reviewedAt),
      promotionalRestrictions: (policy.promotionalRestrictions ?? []).map(
        (item) => item.restriction,
      ),
      responsibleGamingResources: policy.responsibleGamingResources.map((resource) => ({
        label: resource.label,
        url: resource.url,
      })),
      sources: policy.sources.map((source) => ({
        label: source.label,
        publisher: source.publisher,
        url: source.url,
        reviewedAt: isoDate(source.reviewedAt),
      })),
    },
    pages,
    casinos,
    offers,
    redirects: redirectResult.docs.map((redirect: Redirect) => ({
      from: redirect.from,
      to: redirect.to,
      statusCode: redirect.statusCode === '302' ? 302 : 301,
    })),
  }

  return siteSnapshotSchema.parse({
    ...snapshotWithoutChecksum,
    checksum: checksumFor(snapshotWithoutChecksum),
  })
}
