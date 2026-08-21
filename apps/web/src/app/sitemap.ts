import type { MetadataRoute } from 'next'

import { getSiteUrl, getSnapshot } from '@/lib/snapshot'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getSnapshot()
  const baseUrl = getSiteUrl()
  const pages: MetadataRoute.Sitemap = snapshot.pages.map((page) => ({
    url: new URL(page.locale === 'es-CO' ? '/es' : '/', baseUrl).toString(),
    lastModified: page.updatedAt,
    changeFrequency: 'weekly',
    priority: page.route === '/' ? 1 : 0.7,
  }))
  const casinoPages: MetadataRoute.Sitemap = snapshot.casinos.map((casino) => ({
    url: new URL(`/es/casinos/${casino.slug}`, baseUrl).toString(),
    lastModified: casino.verifiedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...pages, ...casinoPages]
}
