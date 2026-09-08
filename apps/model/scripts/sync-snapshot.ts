import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { loadEnvFile } from 'node:process'
import { parseAndVerifySnapshot } from '../src/lib/snapshot'

async function main() {
  if (existsSync('.env.local')) loadEnvFile('.env.local')
  const token = process.env.CMS_DELIVERY_TOKEN
  if (!token)
    throw new Error('Set CMS_DELIVERY_TOKEN before synchronising MODEL.')
  const response = await fetch(
    process.env.CMS_DELIVERY_URL ??
      'http://127.0.0.1:3001/delivery/v1/sites/model/snapshot',
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    },
  )
  if (!response.ok) throw new Error(`CMS returned ${response.status}`)
  const snapshot = parseAndVerifySnapshot(await response.json())
  const target = path.resolve(
    process.env.SNAPSHOT_PATH ?? 'src/data/model.snapshot.json',
  )
  mkdirSync(path.dirname(target), { recursive: true })
  const temporary = `${target}.tmp`
  writeFileSync(temporary, `${JSON.stringify(snapshot, null, 2)}\n`)
  renameSync(temporary, target)
  console.info(
    `MODEL publication ${snapshot.snapshotVersion} saved (${snapshot.casinos.length} casinos).`,
  )
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
