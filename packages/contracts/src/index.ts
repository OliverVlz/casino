import { z } from 'zod'

export const localeCodeSchema = z.enum(['es-CO', 'en-CA', 'fr-CA'])
export type LocaleCode = z.infer<typeof localeCodeSchema>

const sourceSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1),
  reviewedAt: z.iso.datetime(),
})

const heroBlockSchema = z.object({
  blockType: z.literal('hero'),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  summary: z.string().min(1),
  primaryActionLabel: z.string().min(1),
  primaryActionHref: z.string().startsWith('/'),
})

const copyBlockSchema = z.object({
  blockType: z.literal('copy'),
  heading: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  sources: z.array(sourceSchema).default([]),
})

const casinoListBlockSchema = z.object({
  blockType: z.literal('casinoList'),
  heading: z.string().min(1),
  intro: z.string().min(1),
  casinoSlugs: z.array(z.string().min(1)).min(1),
})

const faqBlockSchema = z.object({
  blockType: z.literal('faq'),
  heading: z.string().min(1),
  items: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      sources: z.array(sourceSchema).default([]),
    }),
  ),
})

const responsibleGamingBlockSchema = z.object({
  blockType: z.literal('responsibleGaming'),
  heading: z.string().min(1),
  body: z.string().min(1),
  resources: z.array(
    z.object({
      label: z.string().min(1),
      url: z.url(),
    }),
  ),
})

export const contentBlockSchema = z.discriminatedUnion('blockType', [
  heroBlockSchema,
  copyBlockSchema,
  casinoListBlockSchema,
  faqBlockSchema,
  responsibleGamingBlockSchema,
])
export type ContentBlock = z.infer<typeof contentBlockSchema>

export const snapshotCasinoSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  licenseLabel: z.string().min(1),
  licenseUrl: z.url(),
  verifiedAt: z.iso.datetime(),
  rating: z.number().min(0).max(5).optional(),
  highlights: z.array(z.string().min(1)),
  logoPath: z.string().startsWith('/').optional(),
})
export type SnapshotCasino = z.infer<typeof snapshotCasinoSchema>

export const snapshotOfferSchema = z.object({
  slug: z.string().min(1),
  casinoSlug: z.string().min(1),
  label: z.string().min(1),
  destinationUrl: z.url(),
  termsSummary: z.string().min(1),
  validFrom: z.iso.datetime(),
  validUntil: z.iso.datetime().optional(),
})
export type SnapshotOffer = z.infer<typeof snapshotOfferSchema>

export const jurisdictionPolicySchema = z.object({
  jurisdiction: z.string().min(1),
  minimumAge: z.number().int().min(18),
  effectiveFrom: z.iso.datetime(),
  reviewedAt: z.iso.datetime(),
  promotionalRestrictions: z.array(z.string().min(1)),
  responsibleGamingResources: z.array(
    z.object({ label: z.string().min(1), url: z.url() }),
  ),
  sources: z.array(sourceSchema).min(1),
})
export type JurisdictionPolicy = z.infer<typeof jurisdictionPolicySchema>

export const snapshotPageSchema = z.object({
  id: z.string().min(1),
  locale: localeCodeSchema,
  route: z.string().startsWith('/'),
  title: z.string().min(1),
  description: z.string().min(1),
  canonicalUrl: z.url(),
  equivalentGroup: z.string().min(1).optional(),
  updatedAt: z.iso.datetime(),
  reviewedAt: z.iso.datetime(),
  author: z.object({ name: z.string().min(1), role: z.string().min(1) }),
  blocks: z.array(contentBlockSchema).min(1),
})
export type SnapshotPage = z.infer<typeof snapshotPageSchema>

export const siteSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  snapshotVersion: z.number().int().positive(),
  siteKey: z.string().min(1),
  generatedAt: z.iso.datetime(),
  checksum: z.string().regex(/^[a-f0-9]{64}$/),
  site: z.object({
    name: z.string().min(1),
    domain: z.string().min(1),
    marketCode: z.string().min(1),
    defaultLocale: localeCodeSchema,
    locales: z.array(localeCodeSchema).min(1),
  }),
  policy: jurisdictionPolicySchema,
  pages: z.array(snapshotPageSchema).min(1),
  casinos: z.array(snapshotCasinoSchema),
  offers: z.array(snapshotOfferSchema),
  redirects: z.array(
    z.object({
      from: z.string().startsWith('/'),
      to: z.string().min(1),
      statusCode: z.union([z.literal(301), z.literal(302)]),
    }),
  ),
})
export type SiteSnapshot = z.infer<typeof siteSnapshotSchema>

export const deliveryEventSchema = z.object({
  eventId: z.uuid(),
  siteKey: z.string().min(1),
  snapshotVersion: z.number().int().positive(),
  tags: z.array(z.string().min(1)),
  issuedAt: z.iso.datetime(),
})
export type DeliveryEvent = z.infer<typeof deliveryEventSchema>
