import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { loadEnvFile } from 'node:process'

import { siteSnapshotSchema, type SiteSnapshot } from '@casino/contracts'

const envPath = path.resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  loadEnvFile(envPath)
}

const stableSerialize = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`
  }
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

async function main(): Promise<void> {
  const deliveryUrl = new URL(
    process.env.CMS_DELIVERY_URL ??
      'http://127.0.0.1:3001/delivery/v1/sites/gambling-com/snapshot',
  )
  const token = process.env.CMS_DELIVERY_TOKEN ?? 'delivery-secret-token'
  const response = await fetch(deliveryUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`CMS returned ${response.status} when exporting snapshot`)
  }

  const raw = (await response.json()) as unknown
  const parsed = siteSnapshotSchema.parse(raw) as SiteSnapshot
  const { checksum, ...content } = parsed
  const calculated = createHash('sha256').update(stableSerialize(content)).digest('hex')

  if (calculated !== checksum) {
    throw new Error('Calculated checksum did not match CMS snapshot payload')
  }

  const targetPath = path.resolve(process.cwd(), 'src/data/gambling.snapshot.json')
  writeFileSync(targetPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')
  console.info(`Saved validated snapshot (${parsed.siteKey}) with ${parsed.casinos.length} casinos.`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
