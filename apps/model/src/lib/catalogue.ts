import type { SnapshotCasino, SnapshotOffer } from '@casino/contracts'

export interface ModelCasino {
  slug: string
  name: string
  summary: string
  categories: string[]
  payments: string[]
  minDeposit: number | null
  order: number
  bonus: string
  terms: string
}
const field = (casino: SnapshotCasino, key: string) =>
  casino.highlights
    .find((item) => item.startsWith(`${key}:`))
    ?.slice(key.length + 1)
    .trim()
const list = (value?: string) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []
const numeric = (value?: string) =>
  value && /^\d+(\.\d+)?$/.test(value) ? Number(value) : null

export function parseCasino(
  casino: SnapshotCasino,
  offers: SnapshotOffer[] = [],
): ModelCasino {
  const offer = offers.find((item) => item.casinoSlug === casino.slug)
  return {
    slug: casino.slug,
    name: casino.name,
    summary: casino.summary,
    categories: list(field(casino, 'Categories')),
    payments: list(field(casino, 'Payments')),
    minDeposit: numeric(field(casino, 'MinDepositCAD')),
    order: numeric(field(casino, 'Order')) ?? Number.MAX_SAFE_INTEGER,
    bonus: offer?.label ?? field(casino, 'Bonus') ?? 'No demo offer listed',
    terms:
      offer?.termsSummary ??
      field(casino, 'Terms') ??
      'Conditions not supplied',
  }
}

export interface Filters {
  category: string
  payment: string
  deposit: string
  sort: string
}
export const defaultFilters: Filters = {
  category: 'All',
  payment: 'All',
  deposit: 'All',
  sort: 'order',
}
export function filterCasinos(casinos: ModelCasino[], filters: Filters) {
  return casinos
    .filter(
      (c) =>
        (filters.category === 'All' ||
          c.categories.includes(filters.category)) &&
        (filters.payment === 'All' || c.payments.includes(filters.payment)) &&
        (filters.deposit === 'All' ||
          (c.minDeposit !== null && c.minDeposit <= Number(filters.deposit))),
    )
    .sort((a, b) =>
      filters.sort === 'deposit'
        ? (a.minDeposit ?? Infinity) - (b.minDeposit ?? Infinity) ||
          a.name.localeCompare(b.name)
        : filters.sort === 'name'
          ? a.name.localeCompare(b.name)
          : a.order - b.order || a.name.localeCompare(b.name),
    )
}
export const depositLabel = (value: number | null) =>
  value === null
    ? 'Not supplied'
    : new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
      }).format(value)
