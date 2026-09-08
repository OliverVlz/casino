/** Local integration check: seed MODEL twice, exercise delivery, restore the edited record. */
import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedModel } from '../src/seed'
import { buildSiteSnapshot } from '../src/lib/delivery/buildSiteSnapshot'
import { parseAndVerifySnapshot } from '../../model/src/lib/snapshot'
import { GET as deliver } from '../src/app/(frontend)/delivery/v1/sites/[siteKey]/snapshot/route'

// This check never changes schema: the repository may share a local database with other branches.
process.env.PAYLOAD_MIGRATING = 'true'
const payload = await getPayload({ config })
try {
  const otherSites = await payload.find({
    collection: 'sites',
    limit: 100,
    overrideAccess: true,
    where: { key: { not_equals: 'model' } },
  })
  const before = await Promise.all(
    otherSites.docs.map(async (site) => {
      try {
        return {
          key: site.key,
          checksum: (await buildSiteSnapshot(payload, { siteKey: site.key }))
            .checksum,
        }
      } catch {
        return { key: site.key, checksum: null }
      }
    }),
  )
  await seedModel(payload)
  const first = parseAndVerifySnapshot(
    await buildSiteSnapshot(payload, { siteKey: 'model' }),
  )
  await seedModel(payload)
  const second = parseAndVerifySnapshot(
    await buildSiteSnapshot(payload, { siteKey: 'model' }),
  )
  assert.equal(first.casinos.length, 6)
  assert.equal(second.casinos.length, 6)
  assert.equal(first.pages.length, 2)
  assert.equal(second.pages.length, 2)
  assert.equal(first.offers.length, 6)
  assert.equal(second.offers.length, 6)
  assert.equal(first.checksum, second.checksum)
  const routeContext = { params: Promise.resolve({ siteKey: 'model' }) }
  const denied = await deliver(
    new Request('http://localhost:3001/delivery/v1/sites/model/snapshot'),
    routeContext,
  )
  assert.equal(denied.status, 401)
  const token =
    process.env.DELIVERY_TOKEN ??
    'local-colombia-delivery-only-change-before-production'
  const delivered = await deliver(
    new Request('http://localhost:3001/delivery/v1/sites/model/snapshot', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    routeContext,
  )
  assert.equal(delivered.status, 200)
  assert.equal(parseAndVerifySnapshot(await delivered.json()).siteKey, 'model')
  const sites = await payload.find({
    collection: 'sites',
    overrideAccess: true,
    where: { key: { equals: 'model' } },
  })
  assert.equal(sites.totalDocs, 1)
  const tenant = sites.docs[0].id
  const found = await payload.find({
    collection: 'casinos',
    locale: 'en-CA',
    overrideAccess: true,
    where: {
      and: [{ tenant: { equals: tenant } }, { slug: { equals: 'aurum' } }],
    },
  })
  const casino = found.docs[0]
  const summary = casino.summary
  try {
    await payload.update({
      collection: 'casinos',
      id: casino.id,
      locale: 'en-CA',
      overrideAccess: true,
      context: { skipDelivery: true },
      data: { summary: 'MODEL integration verification marker' },
    })
    const edited = parseAndVerifySnapshot(
      await buildSiteSnapshot(payload, { siteKey: 'model' }),
    )
    assert.equal(
      edited.casinos.find((c) => c.slug === 'aurum')?.summary,
      'MODEL integration verification marker',
    )
    for (const site of before) {
      if (site.checksum)
        assert.equal(
          (await buildSiteSnapshot(payload, { siteKey: site.key })).checksum,
          site.checksum,
          `Unexpected change in ${site.key}`,
        )
    }
  } finally {
    await payload.update({
      collection: 'casinos',
      id: casino.id,
      locale: 'en-CA',
      overrideAccess: true,
      context: { skipDelivery: true },
      data: { summary },
    })
  }
  console.info(
    'MODEL integration passed: idempotent seed, 6 casinos / 6 offers / 2 pages, valid delivery, isolated edit, original summary restored.',
  )
} finally {
  await payload.destroy()
}
// Payload's development background timers can outlive destroy() in a standalone CLI.
process.exit(0)
