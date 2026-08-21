import 'server-only'

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { cache } from 'react'

import { siteSnapshotSchema, type SiteSnapshot } from '@casino/contracts'

import bundledSnapshot from '@/data/colombia.snapshot.json'

const stableSerialize = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
    return `{${entries.join(',')}}`
  }

  return JSON.stringify(value)
}

export const calculateSnapshotChecksum = (snapshot: Omit<SiteSnapshot, 'checksum'>): string =>
  createHash('sha256').update(stableSerialize(snapshot)).digest('hex')

const readSnapshotCandidate = (): unknown => {
  const localPath = process.env.SNAPSHOT_PATH
  if (!localPath || !existsSync(localPath)) return bundledSnapshot
  return JSON.parse(readFileSync(localPath, 'utf8')) as unknown
}

export const parseAndVerifySnapshot = (candidate: unknown): SiteSnapshot => {
  const snapshot = siteSnapshotSchema.parse(candidate)
  const { checksum, ...content } = snapshot
  const calculated = calculateSnapshotChecksum(content)

  if (calculated !== checksum) {
    throw new Error(`Snapshot checksum mismatch for ${snapshot.siteKey}`)
  }

  return snapshot
}

const fetchSnapshot = async (
  url: URL,
  token: string | undefined,
): Promise<SiteSnapshot> => {
  if (!token) throw new Error('Falta el token de entrega del CMS.')
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`El CMS respondió ${response.status} al solicitar el snapshot.`)
  }

  return parseAndVerifySnapshot((await response.json()) as unknown)
}

const deliveryUrl = (): URL =>
  new URL(
    process.env.CMS_DELIVERY_URL ??
      'http://127.0.0.1:3001/delivery/v1/sites/colombia-demo/snapshot',
  )

export const getSnapshot = cache(async (): Promise<SiteSnapshot> => {
  if (process.env.NODE_ENV !== 'production' && process.env.CMS_LIVE_DELIVERY === 'true') {
    try {
      return await fetchSnapshot(deliveryUrl(), process.env.CMS_DELIVERY_TOKEN)
    } catch (error) {
      console.warn(
        'No se pudo leer el CMS; se conserva el último snapshot local válido.',
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

export const getPage = (snapshot: SiteSnapshot, locale: string, route: string) =>
  snapshot.pages.find((page) => page.locale === locale && page.route === route)

export const getSiteUrl = (): URL => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return new URL(configured)
}
