import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSnapshot } from '@/lib/data'
import { parseCasino, depositLabel } from '@/lib/catalogue'
import { CasinoLogo } from '@/components/Catalogue'
import { DemoAction } from '@/components/DemoAction'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const casino = snapshot.casinos.find((c) => c.slug === slug)
  return {
    title: casino ? `${casino.name} — demo profile` : 'Casino not found',
  }
}
export default async function CasinoPage({ params }: Props) {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const source = snapshot.casinos.find((c) => c.slug === slug)
  if (!source) notFound()
  const casino = parseCasino(source, snapshot.offers)
  return (
    <div className="shell subpage review-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/#casino-directory">The collection</Link>
        <span>/</span>
        <span>{casino.name}</span>
      </nav>
      <div className="review-heading">
        <CasinoLogo name={casino.name} />
        <div>
          <h1>{casino.name}</h1>
          <p>Fictional casino concept · Canadian demo catalogue</p>
        </div>
      </div>
      <div className="review-grid">
        <section>
          <h2>A closer look.</h2>
          <p className="review-summary">{casino.summary}</p>
          <dl className="review-facts">
            <div>
              <dt>Casino types</dt>
              <dd>{casino.categories.join(', ') || 'Not supplied'}</dd>
            </div>
            <div>
              <dt>Payment methods</dt>
              <dd>{casino.payments.join(', ') || 'Not supplied'}</dd>
            </div>
            <div>
              <dt>Minimum deposit</dt>
              <dd>{depositLabel(casino.minDeposit)} CAD (illustrative)</dd>
            </div>
            <div>
              <dt>Operator status</dt>
              <dd>Fictional. No operating licence or authorisation implied.</dd>
            </div>
          </dl>
          <h2>Know what you are comparing.</h2>
          <p>
            This profile demonstrates how a casino could be presented. It is not
            a review of a real operator, an endorsement or a verified ranking.
          </p>
          <p>
            For a real operator, independently check its authorisation for your
            location, complete offer terms, payment conditions and
            responsible-play tools.
          </p>
        </section>
        <aside className="offer-panel">
          <h2>{casino.bonus}</h2>
          <p className="quiet-tag">FICTIONAL WELCOME OFFER</p>
          <p>{casino.terms}</p>
          <DemoAction />
          <Link className="text-link" href="/bonuses">
            Compare the other demo offers
          </Link>
        </aside>
      </div>
      <Link href="/#casino-directory" className="button button-outline">
        Back to the collection
      </Link>
    </div>
  )
}
