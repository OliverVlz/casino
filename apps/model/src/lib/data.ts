import 'server-only'
import { existsSync, readFileSync } from 'node:fs'
import { cache } from 'react'
import bundled from '@/data/model.snapshot.json'
import { parseAndVerifySnapshot } from './snapshot'

export const getSnapshot = cache(async () => {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.CMS_LIVE_DELIVERY === 'true'
  ) {
    try {
      if (!process.env.CMS_DELIVERY_TOKEN)
        throw new Error('Missing delivery token')
      const response = await fetch(
        process.env.CMS_DELIVERY_URL ??
          'http://127.0.0.1:3001/delivery/v1/sites/model/snapshot',
        {
          cache: 'no-store',
          signal: AbortSignal.timeout(4000),
          headers: {
            Authorization: `Bearer ${process.env.CMS_DELIVERY_TOKEN}`,
          },
        },
      )
      if (!response.ok) throw new Error(`Delivery returned ${response.status}`)
      return parseAndVerifySnapshot(await response.json())
    } catch (error) {
      console.warn(
        'MODEL delivery unavailable; retaining local publication.',
        error instanceof Error ? error.message : error,
      )
    }
  }
  const local = process.env.SNAPSHOT_PATH
  if (local && existsSync(local)) {
    try {
      return parseAndVerifySnapshot(JSON.parse(readFileSync(local, 'utf8')))
    } catch {
      console.warn('MODEL local snapshot invalid; using bundled publication.')
    }
  }
  return parseAndVerifySnapshot(bundled)
})

export const getSiteUrl = () =>
  new URL(process.env.NEXT_PUBLIC_MODEL_SITE_URL ?? 'http://localhost:3005')
