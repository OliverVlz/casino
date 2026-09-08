'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  defaultFilters,
  depositLabel,
  filterCasinos,
  type ModelCasino,
} from '@/lib/catalogue'
import { Arrow } from './Icons'

export function CasinoLogo({ name }: { name: string }) {
  return (
    <span
      className={`casino-monogram monogram-${name.toLowerCase()}`}
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  )
}
export function Catalogue({
  casinos,
  heading,
  intro,
}: {
  casinos: ModelCasino[]
  heading: string
  intro: string
}) {
  const [filters, setFilters] = useState(defaultFilters)
  const filtered = useMemo(
    () => filterCasinos(casinos, filters),
    [casinos, filters],
  )
  const categories = [...new Set(casinos.flatMap((c) => c.categories))]
  const payments = [...new Set(casinos.flatMap((c) => c.payments))]
  const isFiltered =
    filters.category !== 'All' ||
    filters.payment !== 'All' ||
    filters.deposit !== 'All'

  return (
    <section id="casino-directory" className="section shell catalogue-section">
      <div className="section-heading">
        <div>
          <h2>{heading}</h2>
          <p>{intro}</p>
        </div>
        <span className="quiet-tag">CANADA · DEMO COLLECTION</span>
      </div>
      <div className="filters">
        <label className={filters.category !== 'All' ? 'filter-active' : undefined}>
          What do you enjoy?
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="All">All casino types</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={filters.payment !== 'All' ? 'filter-active' : undefined}>
          How would you pay?
          <select
            value={filters.payment}
            onChange={(e) =>
              setFilters({ ...filters, payment: e.target.value })
            }
          >
            <option value="All">All payment methods</option>
            {payments.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className={filters.deposit !== 'All' ? 'filter-active' : undefined}>
          Maximum minimum deposit
          <select
            value={filters.deposit}
            onChange={(e) =>
              setFilters({ ...filters, deposit: e.target.value })
            }
          >
            <option value="All">Any amount</option>
            <option value="10">Up to $10 CAD</option>
            <option value="25">Up to $25 CAD</option>
            <option value="50">Up to $50 CAD</option>
          </select>
        </label>
        <button
          className="reset-button"
          style={{
            opacity: isFiltered ? 1 : 0.4,
            cursor: isFiltered ? 'pointer' : 'default',
            pointerEvents: isFiltered ? 'auto' : 'none',
          }}
          disabled={!isFiltered}
          onClick={() => setFilters(defaultFilters)}
        >
          Reset filters
        </button>
      </div>
      <div className="results-toolbar">
        <p role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'match' : 'matches'}
          <span> · fictional operators</span>
        </p>
        <label>
          Sort by{' '}
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="order">Demo order</option>
            <option value="deposit">Lowest deposit</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>
      <div className="catalogue-labels" aria-hidden="true">
        <span>THE CASINO</span>
        <span>EXAMPLE WELCOME OFFER</span>
        <span>PAYMENT OPTIONS</span>
        <span>TAKE A CLOSER LOOK</span>
      </div>
      <div className="casino-list">
        {filtered.map((c) => (
          <article key={c.slug} className="casino-row">
            <div className="casino-identity">
              <CasinoLogo name={c.name} />
              <div>
                <Link className="casino-name" href={`/casino/${c.slug}`}>
                  {c.name}
                </Link>
                <p>{c.categories.join(' · ') || 'Category not supplied'}</p>
              </div>
            </div>
            <div className="casino-offer">
              <strong>{c.bonus}</strong>
              <p>Min. deposit {depositLabel(c.minDeposit)} CAD</p>
            </div>
            <div className="payment-list">
              {c.payments.length ? (
                c.payments.map((p) => <span key={p}>{p}</span>)
              ) : (
                <span>Not supplied</span>
              )}
            </div>
            <Link className="button button-outline" href={`/casino/${c.slug}`}>
              Explore demo <Arrow diagonal />
            </Link>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>No matches for this combination.</h3>
          <p>Try another payment method or a higher deposit limit.</p>
          <button
            className="button button-gold"
            onClick={() => setFilters(defaultFilters)}
          >
            Show all casinos
          </button>
        </div>
      )}
      <p className="catalogue-note">
        A clear view, not a recommendation. All names, offers and values in this
        collection are fictional.{' '}
        <a href="#methodology">
          How to read this demo <Arrow diagonal />
        </a>
      </p>
    </section>
  )
}
