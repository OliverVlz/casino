import { createHash } from 'node:crypto'
import { siteSnapshotSchema, type SiteSnapshot } from '@casino/contracts'

export const stableSerialize = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`
  if (value && typeof value === 'object')
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, 'en'))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
      .join(',')}}`
  return JSON.stringify(value)
}

export function parseAndVerifySnapshot(candidate: unknown): SiteSnapshot {
  const snapshot = siteSnapshotSchema.parse(candidate)
  if (snapshot.siteKey !== 'model')
    throw new Error('Snapshot belongs to another site')
  const { checksum, ...content } = snapshot
  const calculated = createHash('sha256')
    .update(stableSerialize(content))
    .digest('hex')
  if (checksum !== calculated) throw new Error('Snapshot checksum mismatch')
  return snapshot
}
