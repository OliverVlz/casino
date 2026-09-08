import { getSnapshot, getCasinos } from '@/lib/data'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CasinoCard } from '@/components/CasinoCard'
import { CasinoTable } from '@/components/CasinoTable'
import { InteracSection } from '@/components/InteracSection'
import { OntarioSection } from '@/components/OntarioSection'
import { GuidesAndNewsSection } from '@/components/GuidesAndNewsSection'
import { FaqSection } from '@/components/FaqSection'

export const revalidate = 3600

export default async function HomePage() {
  const snapshot = await getSnapshot()
  const casinos = getCasinos(snapshot)
  const offers = snapshot.offers ?? []

  const top6Casinos = casinos.slice(0, 6)

  return (
    <main className="min-h-screen">
      <Header />

      {/* HERO SECTION */}
      <section className="hero-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="badge badge-gold text-sm px-4 py-2">
                🍁 Updated May 2026 — Canada Only
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
              Best Online Casino <br />
              <span className="text-gradient">Canada 2026</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              We rank and review online casinos exclusively for Canadian players. Every casino on this list accepts{' '}
              <strong className="text-white">Interac e-Transfer</strong>, pays out in{' '}
              <strong className="text-white">CAD</strong>, and holds a valid Canadian-recognized license.
            </p>

            {/* KEY METRICS GRID */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <p className="text-3xl font-black text-gradient">10</p>
                <p className="text-sm text-gray-400">Tested Casinos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gradient">5</p>
                <p className="text-sm text-gray-400">iGaming Ontario</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gradient">10/10</p>
                <p className="text-sm text-gray-400">Interac Support</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gradient">CAD</p>
                <p className="text-sm text-gray-400">All Bonuses</p>
              </div>
            </div>

            {/* QUICK PILL BUTTONS */}
            <div className="flex flex-wrap justify-center gap-3">
              <a className="btn-secondary text-sm py-2 px-5" href="#interac">
                🏦 Interac Casinos
              </a>
              <a className="btn-secondary text-sm py-2 px-5" href="#ontario">
                🍁 Ontario Licensed
              </a>
              <a className="btn-secondary text-sm py-2 px-5" href="#bonuses">
                💰 Best Bonuses
              </a>
              <a className="btn-secondary text-sm py-2 px-5" href="/#top10">
                🎁 No Deposit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 6 GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="bonuses">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Top 6 Canadian Casinos</h2>
            <p className="text-gray-400 mt-1">
              Ranked by bonus value, Interac speed, and license quality
            </p>
          </div>
          <span className="badge badge-gold hidden md:block">🍁 Canada Only</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top6Casinos.map((casino, index) => {
            const offer = offers.find((o) => o.casinoSlug === casino.slug)
            return (
              <CasinoCard
                casino={casino}
                index={index}
                key={casino.slug}
                offer={offer}
              />
            )
          })}
        </div>
      </section>

      {/* ALL 10 TABLE */}
      <CasinoTable casinos={casinos} offers={offers} />

      {/* INTERAC SECTION */}
      <InteracSection />

      {/* ONTARIO SECTION */}
      <OntarioSection casinos={casinos} />

      {/* GUIDES AND NEWS */}
      <GuidesAndNewsSection />

      {/* FAQ SECTION */}
      <FaqSection />

      <Footer />
    </main>
  )
}
