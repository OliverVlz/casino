import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnvFile } from 'node:process'

import { siteSnapshotSchema, type SiteSnapshot } from '@casino/contracts'

const envPath = path.resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) loadEnvFile(envPath)

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

const verify = (candidate: unknown): SiteSnapshot => {
  const snapshot = siteSnapshotSchema.parse(candidate)
  const { checksum, ...content } = snapshot
  const calculated = createHash('sha256').update(stableSerialize(content)).digest('hex')
  if (calculated !== checksum) throw new Error('El checksum recibido desde Payload no coincide.')
  return snapshot
}

async function syncSnapshot(): Promise<void> {
  const url =
    process.env.CMS_DELIVERY_URL ??
    'http://127.0.0.1:3001/delivery/v1/sites/colombia-demo/snapshot'
  const token = process.env.CMS_DELIVERY_TOKEN
  if (!token) throw new Error('CMS_DELIVERY_TOKEN es obligatorio para sincronizar.')

  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`Payload respondió ${response.status} durante la sincronización.`)
  const snapshot = verify((await response.json()) as unknown)

  const configuredPath = process.env.SNAPSHOT_PATH ?? '.snapshot-staging/colombia.snapshot.json'
  const destination = path.resolve(process.cwd(), configuredPath)
  const temporary = `${destination}.${process.pid}.tmp`
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  await rename(temporary, destination)

  console.info(`Snapshot ${snapshot.snapshotVersion} aplicado en ${destination}`)
}

syncSnapshot().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
