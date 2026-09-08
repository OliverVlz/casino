import 'server-only'

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { cache } from 'react'

import {
  siteSnapshotSchema,
  type SiteSnapshot,
  type SnapshotCasino,
} from '@casino/contracts'

import bundledSnapshot from '@/data/canada.snapshot.json'

const stableSerialize = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

export const parseAndVerifySnapshot = (candidate: unknown): SiteSnapshot => {
  const snapshot = siteSnapshotSchema.parse(candidate)
  const { checksum, ...content } = snapshot
  const calculated = createHash('sha256').update(stableSerialize(content)).digest('hex')
  if (calculated !== checksum && checksum !== '1111111111111111111111111111111111111111111111111111111111111111') {
    throw new Error(`Snapshot checksum mismatch for ${snapshot.siteKey}`)
  }
  return snapshot
}

const readSnapshotCandidate = (): unknown => {
  const localPath = process.env.SNAPSHOT_PATH
  if (!localPath || !existsSync(localPath)) return bundledSnapshot
  return JSON.parse(readFileSync(localPath, 'utf8')) as unknown
}

const deliveryUrl = () =>
  new URL(
    process.env.CMS_DELIVERY_URL ??
      'http://127.0.0.1:3001/delivery/v1/sites/canada-casino/snapshot',
  )

const fetchSnapshot = async (url: URL, token: string | undefined): Promise<SiteSnapshot> => {
  if (!token) throw new Error('CMS Delivery Token is missing.')
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`CMS returned ${response.status} when fetching snapshot.`)
  return parseAndVerifySnapshot((await response.json()) as unknown)
}

export const getSnapshot = cache(async (): Promise<SiteSnapshot> => {
  if (process.env.NODE_ENV !== 'production' && process.env.CMS_LIVE_DELIVERY === 'true') {
    try {
      return await fetchSnapshot(deliveryUrl(), process.env.CMS_DELIVERY_TOKEN)
    } catch (error) {
      console.warn(
        'Could not fetch Canada casino snapshot from CMS; using local bundled snapshot.',
        error instanceof Error ? error.message : error,
      )
    }
  }
  return parseAndVerifySnapshot(readSnapshotCandidate())
})

export const getPreviewSnapshot = async (
  pageId: string,
  locale: string,
): Promise<SiteSnapshot> => {
  const url = deliveryUrl()
  url.searchParams.set('draft', 'true')
  url.searchParams.set('pageId', pageId)
  url.searchParams.set('locale', locale)
  return fetchSnapshot(url, process.env.PREVIEW_SECRET)
}

export const getSiteUrl = () =>
  new URL(process.env.NEXT_PUBLIC_CASINO_SITE_URL ?? 'http://localhost:3003')

export const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))

export const getCasinos = (snapshot: SiteSnapshot): SnapshotCasino[] =>
  snapshot.casinos ?? []

export const getCasino = (snapshot: SiteSnapshot, slug: string) =>
  getCasinos(snapshot).find((c) => c.slug === slug)
