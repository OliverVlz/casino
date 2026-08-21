import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { loadEnvFile } from 'node:process'
import { pathToFileURL } from 'node:url'

import { siteSnapshotSchema, type ContentBlock, type SiteSnapshot } from '@casino/contracts'
import type { Payload } from 'payload'

import type { Page } from '@/payload-types'

const envPath = path.resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) loadEnvFile(envPath)

const snapshotPath = path.resolve(process.cwd(), '../web/src/data/colombia.snapshot.json')

const lexicalDocument = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map((paragraph) => ({
      type: 'paragraph',
      children: [
        {
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: paragraph,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      textFormat: 0,
      textStyle: '',
      version: 1,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const pageBlock = (
  block: ContentBlock,
  casinoIdsBySlug: Map<string, number>,
): Page['layout'][number] => {
  switch (block.blockType) {
    case 'hero':
      return { ...block, blockType: 'hero' }
    case 'casinoList':
      return {
        blockType: 'casinoList',
        heading: block.heading,
        intro: block.intro,
        casinos: block.casinoSlugs.map((slug) => {
          const id = casinoIdsBySlug.get(slug)
          if (!id) throw new Error(`No se encontró el casino ${slug} al construir la página.`)
          return id
        }),
      }
    case 'copy':
      return {
        blockType: 'copy',
        heading: block.heading,
        body: lexicalDocument(block.body),
        sources: block.sources.map((source) => ({ ...source })),
      }
    case 'faq':
      return {
        blockType: 'faq',
        heading: block.heading,
        items: block.items.map((item) => ({
          question: item.question,
          answer: item.answer,
          sources: item.sources.map((source) => ({ ...source })),
        })),
      }
    case 'responsibleGaming':
      return { ...block, blockType: 'responsibleGaming' }
  }
}

export async function seedColombia(payload: Payload): Promise<void> {
  const source = siteSnapshotSchema.parse(
    JSON.parse(readFileSync(snapshotPath, 'utf8')) as unknown,
  ) as SiteSnapshot

  const localeResult = await payload.find({
      collection: 'locales',
      limit: 1,
      overrideAccess: true,
      where: { code: { equals: source.site.defaultLocale } },
    })
    const locale =
      localeResult.docs[0] ??
      (await payload.create({
        collection: 'locales',
        overrideAccess: true,
        data: {
          label: 'Español (Colombia)',
          code: 'es-CO',
          languageCode: 'es',
        },
      }))

    const marketResult = await payload.find({
      collection: 'markets',
      limit: 1,
      overrideAccess: true,
      where: { code: { equals: source.site.marketCode } },
    })
    const market =
      marketResult.docs[0] ??
      (await payload.create({
        collection: 'markets',
        overrideAccess: true,
        data: {
          name: 'Colombia',
          code: source.site.marketCode,
          countryCode: 'CO',
          jurisdiction: source.policy.jurisdiction,
        },
      }))

    const siteResult = await payload.find({
      collection: 'sites',
      limit: 1,
      overrideAccess: true,
      where: { key: { equals: source.siteKey } },
    })
    const site =
      siteResult.docs[0] ??
      (await payload.create({
        collection: 'sites',
        overrideAccess: true,
        data: {
          name: `${source.site.name} — Colombia`,
          key: source.siteKey,
          domain: source.site.domain,
          market: market.id,
          defaultLocale: locale.id,
          supportedLocales: [locale.id],
          status: 'development',
          theme: {
            brandName: source.site.name,
            accentColor: '#fd6f27',
          },
          syncStatus: { appliedVersion: 0, state: 'never' },
        },
      }))

    const policyResult = await payload.find({
      collection: 'jurisdiction-policies',
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { tenant: { equals: site.id } },
          { jurisdiction: { equals: source.policy.jurisdiction } },
        ],
      },
    })
    if (!policyResult.docs[0]) {
      await payload.create({
        collection: 'jurisdiction-policies',
        overrideAccess: true,
        data: {
          tenant: site.id,
          title: `Política de demostración — ${source.policy.jurisdiction}`,
          jurisdiction: source.policy.jurisdiction,
          effectiveFrom: source.policy.effectiveFrom,
          reviewedAt: source.policy.reviewedAt,
          minimumAge: source.policy.minimumAge,
          promotionalRestrictions: source.policy.promotionalRestrictions.map((restriction) => ({
            restriction,
          })),
          responsibleGamingResources: source.policy.responsibleGamingResources.map((resource) => ({
            ...resource,
          })),
          sources: source.policy.sources.map((item) => ({ ...item })),
          approval: {
            approved: false,
            approvalNote: 'Contenido ficticio de desarrollo; requiere revisión competente antes de producción.',
          },
        },
      })
    }

    const casinoIdsBySlug = new Map<string, number>()
    for (const casinoSource of source.casinos) {
      const existing = await payload.find({
        collection: 'casinos',
        draft: true,
        limit: 1,
        locale: 'es-CO',
        overrideAccess: true,
        where: {
          and: [
            { tenant: { equals: site.id } },
            { slug: { equals: casinoSource.slug } },
          ],
        },
      })
      const casino =
        existing.docs[0] ??
        (await payload.create({
          collection: 'casinos',
          context: { skipDelivery: true },
          draft: false,
          locale: 'es-CO',
          overrideAccess: true,
          data: {
            tenant: site.id,
            _status: 'published',
            name: casinoSource.name,
            slug: casinoSource.slug,
            summary: casinoSource.summary,
            licenseLabel: casinoSource.licenseLabel,
            licenseUrl: casinoSource.licenseUrl,
            verifiedAt: casinoSource.verifiedAt,
            ...(typeof casinoSource.rating === 'number' ? { rating: casinoSource.rating } : {}),
            highlights: casinoSource.highlights.map((label) => ({ label })),
          },
        }))
      casinoIdsBySlug.set(casino.slug, casino.id)
    }

    for (const offerSource of source.offers) {
      const existing = await payload.find({
        collection: 'offers',
        draft: true,
        limit: 1,
        locale: 'es-CO',
        overrideAccess: true,
        where: {
          and: [
            { tenant: { equals: site.id } },
            { slug: { equals: offerSource.slug } },
          ],
        },
      })
      if (existing.docs[0]) continue
      const casinoId = casinoIdsBySlug.get(offerSource.casinoSlug)
      if (!casinoId) throw new Error(`No existe el casino ${offerSource.casinoSlug} para la oferta.`)

      await payload.create({
        collection: 'offers',
        context: { skipDelivery: true },
        draft: false,
        locale: 'es-CO',
        overrideAccess: true,
        data: {
          tenant: site.id,
          _status: 'published',
          label: offerSource.label,
          slug: offerSource.slug,
          casino: casinoId,
          destinationUrl: offerSource.destinationUrl,
          termsSummary: offerSource.termsSummary,
          validFrom: offerSource.validFrom,
          ...(offerSource.validUntil ? { validUntil: offerSource.validUntil } : {}),
          enabled: true,
        },
      })
    }

    for (const pageSource of source.pages) {
      const existing = await payload.find({
        collection: 'pages',
        draft: true,
        limit: 1,
        locale: pageSource.locale,
        overrideAccess: true,
        where: {
          and: [
            { tenant: { equals: site.id } },
            { route: { equals: pageSource.route } },
          ],
        },
      })
      if (existing.docs[0]) continue

      await payload.create({
        collection: 'pages',
        context: { skipDelivery: true },
        draft: false,
        locale: pageSource.locale,
        overrideAccess: true,
        data: {
          tenant: site.id,
          _status: 'published',
          title: pageSource.title,
          route: pageSource.route,
          description: pageSource.description,
          ...(pageSource.equivalentGroup
            ? { equivalentGroup: pageSource.equivalentGroup }
            : {}),
          reviewedAt: pageSource.reviewedAt,
          author: { ...pageSource.author },
          layout: pageSource.blocks.map((block) => pageBlock(block, casinoIdsBySlug)),
          publishingChecks: {
            sourcesReviewed: true,
            translationHumanReviewed: true,
            regulatoryReviewComplete: true,
          },
        },
      })
    }

  payload.logger.info('Contenido inicial de Colombia disponible en Payload.')
}

async function runFromCommandLine(): Promise<void> {
  const cmsUrl = process.env.CMS_URL ?? 'http://localhost:3001'
  const token = process.env.SEED_SECRET ?? 'local-seed-only-change-before-production'
  const response = await fetch(new URL('/dev/seed', cmsUrl), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Payload respondió ${response.status} al importar Colombia.`)
  }

  console.info('Contenido inicial de Colombia disponible en Payload.')
}

const invokedFile = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ''
if (import.meta.url === invokedFile) {
  runFromCommandLine().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
