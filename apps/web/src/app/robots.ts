import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/snapshot'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  const indexable = process.env.SITE_INDEXABLE === 'true'

  if (!indexable) {
    return { rules: { userAgent: '*', disallow: '/' }, host: siteUrl.origin }
  }

  return {
    rules: [
      { userAgent: 'GPTBot', disallow: '/' },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Perplexity-User',
        ],
        allow: '/',
      },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl.origin,
  }
}
