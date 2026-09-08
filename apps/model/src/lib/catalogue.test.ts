import assert from 'node:assert/strict'
import test from 'node:test'
import snapshot from '../data/model.snapshot.json'
import { defaultFilters, filterCasinos, parseCasino } from './catalogue'
import { parseAndVerifySnapshot, stableSerialize } from './snapshot'
import { createHash } from 'node:crypto'

const data = parseAndVerifySnapshot(snapshot)
const casinos = data.casinos.map((c) => parseCasino(c, data.offers))
test('combines explicit category, payment and maximum minimum-deposit filters', () => {
  assert.deepEqual(
    filterCasinos(casinos, {
      category: 'Slots',
      payment: 'Card',
      deposit: '10',
      sort: 'deposit',
    }).map((c) => c.slug),
    ['forma', 'nocturne'],
  )
  assert.equal(
    filterCasinos(casinos, {
      ...defaultFilters,
      category: 'Live casino',
      payment: 'Card',
      deposit: '10',
    }).length,
    0,
  )
  assert.equal(filterCasinos(casinos, defaultFilters).length, 6)
})
test('sorts numerically and does not mutate the input', () => {
  assert.deepEqual(
    filterCasinos(casinos, { ...defaultFilters, sort: 'deposit' }).map(
      (c) => c.minDeposit,
    ),
    [5, 10, 20, 25, 50, 100],
  )
  assert.equal(casinos[0].slug, 'aurum')
})
test('missing properties stay unknown and are never inferred from name', () => {
  const c = parseCasino({
    ...data.casinos[0],
    name: 'Crypto Slots',
    highlights: [],
  })
  assert.deepEqual(c.categories, [])
  assert.deepEqual(c.payments, [])
  assert.equal(c.minDeposit, null)
  assert.equal(
    filterCasinos([c], { ...defaultFilters, deposit: '25' }).length,
    0,
  )
})
test('rejects corrupt snapshots and foreign tenants even with valid checksums', () => {
  assert.throws(
    () => parseAndVerifySnapshot({ ...snapshot, snapshotVersion: 2 }),
    /checksum/,
  )
  assert.throws(
    () => parseAndVerifySnapshot({ ...snapshot, checksum: '1'.repeat(64) }),
    /checksum/,
  )
  const { checksum: _, ...foreign } = { ...snapshot, siteKey: 'gambling-com' }
  const checksum = createHash('sha256')
    .update(stableSerialize(foreign))
    .digest('hex')
  assert.throws(
    () => parseAndVerifySnapshot({ ...foreign, checksum }),
    /another site/,
  )
})
