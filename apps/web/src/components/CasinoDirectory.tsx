'use client'

import type { SnapshotCasino, SnapshotOffer } from '@casino/contracts'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Icon } from '@/components/Icon'
import { Button, buttonVariants } from '@/components/ui/button'

type Props = {
  casinos: SnapshotCasino[]
  heading: string
  intro: string
  localePath: string
  offers: SnapshotOffer[]
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(new Date(value))
    .replace('.', '')
    .toUpperCase()

export function CasinoDirectory({ casinos, heading, intro, localePath, offers }: Props) {
  const [sort, setSort] = useState<'updated' | 'name'>('updated')

  const sortedCasinos = useMemo(() => {
    return [...casinos].sort((left, right) => {
      if (sort === 'name') return left.name.localeCompare(right.name, 'es')
      return Date.parse(right.verifiedAt) - Date.parse(left.verifiedAt)
    })
  }, [casinos, sort])

  return (
    <section aria-labelledby="casino-list-heading" className="directory-shell" id="casinos">
      <div className="directory-heading">
        <div>
          <h2 id="casino-list-heading">{heading}</h2>
          <p>{intro}</p>
        </div>
        <label className="sort-control">
          <span>Ordenar:</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as 'updated' | 'name')}>
            <option value="updated">actualización</option>
            <option value="name">nombre</option>
          </select>
        </label>
      </div>

      <div className="casino-list">
        {sortedCasinos.length === 0 ? (
          <div className="empty-state">
            <h3>No hay fichas publicadas</h3>
            <p>Vuelve cuando el equipo editorial haya completado la revisión.</p>
          </div>
        ) : (
          sortedCasinos.map((casino) => {
            const offer = offers.find((item) => item.casinoSlug === casino.slug)
            const sourceIndex = casinos.findIndex((item) => item.slug === casino.slug)
            const documentId = `DEMO-${String(sourceIndex + 1).padStart(3, '0')}`
            return (
              <article className="casino-row" id={casino.slug} key={casino.slug}>
                <div className={`casino-mark casino-mark--${(sourceIndex % 3) + 1}`} aria-hidden="true">
                  {casino.name.replace('Demo ', '').slice(0, 1)}
                </div>

                <div className="casino-summary">
                  <h3>{casino.name}</h3>
                  <p>{casino.summary}</p>
                </div>

                <dl className="casino-metadata">
                  <div>
                    <dt><Icon name="document" /> Documento</dt>
                    <dd>{documentId}</dd>
                  </div>
                  <div>
                    <dt><Icon name="status" /> Estado</dt>
                    <dd className="status-pending">Pendiente</dd>
                  </div>
                  <div>
                    <dt><Icon name="calendar" /> Actualizado</dt>
                    <dd>{formatDate(casino.verifiedAt)}</dd>
                  </div>
                </dl>

                <div className="casino-actions">
                  <Link
                    className={buttonVariants({ variant: 'outline' })}
                    href={`${localePath}/casinos/${casino.slug}`}
                  >
                    Leer ficha
                  </Link>
                  {offer ? (
                    <Link
                      aria-label={`Visitar destino de demostración de ${casino.name}`}
                      className={buttonVariants({ variant: 'primary' })}
                      href={`/go/${offer.slug}`}
                      prefetch={false}
                      rel="nofollow sponsored"
                    >
                      Visitar <Icon name="external" size={17} />
                    </Link>
                  ) : (
                    <Button disabled>
                      No disponible
                    </Button>
                  )}
                </div>
              </article>
            )
          })
        )}
      </div>

      <p className="development-label">
        <Icon name="info" size={16} /> Información ficticia para desarrollo
      </p>
    </section>
  )
}
