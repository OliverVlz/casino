import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CasinoDetail } from '@/components/CasinoDetail'
import { PageRenderer } from '@/components/PageRenderer'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getPage, getSiteUrl, getSnapshot } from '@/lib/snapshot'

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>
}

const localeMap = { es: 'es-CO' } as const

const resolveRequest = async (paramsPromise: Props['params']) => {
  const params = await paramsPromise
  const localeCode = localeMap[params.locale as keyof typeof localeMap]
  if (!localeCode) return null
  const route = params.slug?.length ? `/${params.slug.join('/')}` : '/'
  return { localeCode, localePath: `/${params.locale}`, route }
}

const canonicalFor = (localePath: string, route: string) =>
  new URL(`${localePath}${route === '/' ? '' : route}`, getSiteUrl()).toString()

export async function generateStaticParams() {
  const snapshot = await getSnapshot()
  return [
    ...snapshot.pages.map((page) => ({ locale: page.locale === 'es-CO' ? 'es' : page.locale, slug: [] })),
    ...snapshot.casinos.map((casino) => ({ locale: 'es', slug: ['casinos', casino.slug] })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const request = await resolveRequest(params)
  if (!request) return { title: 'Página no encontrada', robots: { index: false, follow: false } }

  const snapshot = await getSnapshot()
  const page = getPage(snapshot, request.localeCode, request.route)
  const indexable = process.env.SITE_INDEXABLE === 'true'

  if (page) {
    const canonical = canonicalFor(request.localePath, request.route)
    return {
      title: { absolute: page.title },
      description: page.description,
      alternates: { canonical },
      robots: { index: indexable, follow: indexable },
      openGraph: {
        type: 'website',
        locale: 'es_CO',
        url: canonical,
        siteName: snapshot.site.name,
        title: page.title,
        description: page.description,
      },
    }
  }

  const casinoSlug = request.route.match(/^\/casinos\/([^/]+)$/)?.[1]
  const casino = casinoSlug ? snapshot.casinos.find((item) => item.slug === casinoSlug) : undefined
  if (!casino) return { title: 'Página no encontrada', robots: { index: false, follow: false } }

  const canonical = canonicalFor(request.localePath, request.route)
  return {
    title: `${casino.name} — ficha editorial`,
    description: casino.summary,
    alternates: { canonical },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      type: 'article',
      locale: 'es_CO',
      url: canonical,
      title: `${casino.name} — ficha editorial`,
      description: casino.summary,
    },
  }
}

export default async function LocalizedPage({ params }: Props) {
  const request = await resolveRequest(params)
  if (!request) notFound()

  const snapshot = await getSnapshot()
  const page = getPage(snapshot, request.localeCode, request.route)

  if (page) {
    const canonical = canonicalFor(request.localePath, request.route)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: canonical,
      inLanguage: page.locale,
      dateModified: page.updatedAt,
      isPartOf: {
        '@type': 'WebSite',
        name: snapshot.site.name,
        url: getSiteUrl().toString(),
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: snapshot.casinos.map((casino, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: casino.name,
          url: new URL(`/es/casinos/${casino.slug}`, getSiteUrl()).toString(),
        })),
      },
    }

    return (
      <>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
          type="application/ld+json"
        />
        <SiteHeader />
        <PageRenderer page={page} snapshot={snapshot} />
        <SiteFooter updatedAt={page.reviewedAt} />
      </>
    )
  }

  const casinoSlug = request.route.match(/^\/casinos\/([^/]+)$/)?.[1]
  const casino = casinoSlug ? snapshot.casinos.find((item) => item.slug === casinoSlug) : undefined
  if (!casino) notFound()

  const offer = snapshot.offers.find((item) => item.casinoSlug === casino.slug)
  return (
    <>
      <SiteHeader />
      <CasinoDetail casino={casino} offer={offer} />
      <SiteFooter updatedAt={casino.verifiedAt} />
    </>
  )
}
