import type { SnapshotCasino, SnapshotOffer } from '@casino/contracts'
import Link from 'next/link'

import { Icon } from '@/components/Icon'
import { buttonVariants } from '@/components/ui/button'

export function CasinoDetail({ casino, offer }: { casino: SnapshotCasino; offer?: SnapshotOffer }) {
  const date = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(casino.verifiedAt))

  return (
    <main className="detail-page">
      <div className="detail-page__inner">
        <Link className="back-link" href="/es#casinos">
          <Icon name="arrow" size={17} /> Volver al listado
        </Link>
        <p className="development-label development-label--left">
          <Icon name="info" size={16} /> Ficha ficticia para desarrollo
        </p>
        <h1>{casino.name}</h1>
        <p className="detail-lead">{casino.summary}</p>

        <div className="detail-grid">
          <article>
            <h2>Estado editorial</h2>
            <dl className="detail-metadata">
              <div><dt>Documento</dt><dd>{casino.licenseLabel}</dd></div>
              <div><dt>Última revisión</dt><dd>{date}</dd></div>
              <div><dt>Estado</dt><dd className="status-pending">Pendiente de fuente real</dd></div>
            </dl>
          </article>
          <aside>
            <h2>Antes de continuar</h2>
            <p>Esta ficha no identifica un operador real ni acredita una licencia. Consulta siempre la fuente oficial.</p>
            <a
              href="https://www.coljuegos.gov.co/publicaciones/301841/juegosonline/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ver lista oficial de Coljuegos <Icon name="external" size={16} />
            </a>
          </aside>
        </div>

        {offer ? (
          <div className="detail-action">
            <div>
              <strong>{offer.label}</strong>
              <p>{offer.termsSummary}</p>
            </div>
            <Link
              className={buttonVariants({ variant: 'primary' })}
              href={`/go/${offer.slug}`}
              prefetch={false}
              rel="nofollow sponsored"
            >
              Abrir destino demo <Icon name="external" size={17} />
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  )
}
