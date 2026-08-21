import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'node:path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

import { isAdminUser } from '@/access'
import { Casinos } from '@/collections/Casinos'
import { JurisdictionPolicies } from '@/collections/JurisdictionPolicies'
import { Locales } from '@/collections/Locales'
import { Markets } from '@/collections/Markets'
import { Media } from '@/collections/Media'
import { Offers } from '@/collections/Offers'
import { Pages } from '@/collections/Pages'
import { Publications } from '@/collections/Publications'
import { Redirects } from '@/collections/Redirects'
import { Sites } from '@/collections/Sites'
import { Users } from '@/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const production = process.env.NODE_ENV === 'production'
const productionBuild = process.env.NEXT_PHASE === 'phase-production-build'
const secret =
  process.env.PAYLOAD_SECRET ??
  (!production || productionBuild ? 'build-or-local-only-change-before-production' : undefined)

if (!secret) {
  throw new Error('PAYLOAD_SECRET es obligatorio en producción.')
}

const previewSecret =
  process.env.PREVIEW_SECRET ??
  (!production || productionBuild ? 'local-preview-only-change-before-production' : undefined)

if (!previewSecret) {
  throw new Error('PREVIEW_SECRET es obligatorio en producción.')
}

const s3Enabled = Boolean(process.env.S3_BUCKET)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Control editorial',
    },
    livePreview: {
      collections: [Pages.slug],
      openByDefault: false,
      breakpoints: [
        { name: 'mobile', label: 'Móvil', width: 390, height: 844 },
        { name: 'desktop', label: 'Escritorio', width: 1440, height: 900 },
      ],
      url: ({ data, locale }) => {
        if (!data.id) return null

        const frontendUrl = process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000'
        const localeCode = typeof locale === 'object' ? locale.code : locale
        const query = new URLSearchParams({
          secret: previewSecret,
          locale: localeCode || 'es-CO',
        })

        return `${frontendUrl}/preview/${data.id}?${query.toString()}`
      },
    },
  },
  collections: [
    Users,
    Markets,
    Locales,
    Sites,
    JurisdictionPolicies,
    Pages,
    Casinos,
    Offers,
    Media,
    Redirects,
    Publications,
  ],
  localization: {
    locales: [
      { label: 'Español (Colombia)', code: 'es-CO' },
      { label: 'English (Canada)', code: 'en-CA' },
      { label: 'Français (Canada)', code: 'fr-CA' },
    ],
    defaultLocale: 'es-CO',
    fallback: false,
  },
  editor: lexicalEditor(),
  secret,
  serverURL: process.env.CMS_URL ?? 'http://localhost:3001',
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ?? 'postgres://casino:casino@127.0.0.1:5433/casino_cms',
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: (process.env.CMS_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
  csrf: (process.env.CMS_ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim()),
  plugins: [
    multiTenantPlugin({
      tenantsSlug: Sites.slug,
      collections: {
        'jurisdiction-policies': {},
        pages: {},
        casinos: {},
        offers: {},
        media: {},
        redirects: {},
        publications: {},
      },
      tenantsArrayField: {
        includeDefaultField: true,
        arrayFieldName: 'sites',
        arrayTenantFieldName: 'site',
      },
      userHasAccessToAllTenants: isAdminUser,
    }),
    s3Storage({
      enabled: s3Enabled,
      alwaysInsertFields: true,
      collections: { media: true },
      bucket: process.env.S3_BUCKET ?? 'casino-media',
      config: {
        endpoint: process.env.S3_ENDPOINT ?? 'http://127.0.0.1:9000',
        region: process.env.S3_REGION ?? 'us-east-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY ?? 'minioadmin',
          secretAccessKey: process.env.S3_SECRET_KEY ?? 'minioadmin',
        },
      },
    }),
  ],
})
