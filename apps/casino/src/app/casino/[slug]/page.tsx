import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getSnapshot, getCasino, formatReviewDate } from '@/lib/data'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const casino = getCasino(snapshot, slug)

  if (!casino) return { title: 'Casino Not Found' }

  return {
    title: `${casino.name} Review 2026 – Canada & Interac | BestCasinoRanker`,
    description: casino.summary,
  }
}

export default async function CasinoReviewPage({ params }: Props) {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const casino = getCasino(snapshot, slug)

  if (!casino) notFound()

  const offer = snapshot.offers?.find((o) => o.casinoSlug === casino.slug)
  const minDeposit = casino.highlights.find((h) => h.startsWith('Min Deposit'))?.replace('Min Deposit ', '') ?? 'C$10'
  const withdrawal = casino.highlights.find((h) => h.startsWith('Withdrawal:'))?.replace('Withdrawal: ', '') ?? '1–3 days via Interac'
  const wagering = casino.highlights.find((h) => h.startsWith('Wagering:'))?.replace('Wagering: ', '') ?? '35x'
  const welcomeBonus = casino.highlights.find((h) => h.startsWith('Welcome Bonus:'))?.replace('Welcome Bonus: ', '') ?? 'C$1,000 Welcome Package'
  const badgeText = casino.highlights.find((h) => h.startsWith('Badge:'))?.replace('Badge: ', '') ?? 'Verified'
  const gamesCount = casino.highlights.find((h) => h.includes('Games'))?.replace(' Games', '') ?? '500+'

  return (
    <main className="min-h-screen bg-[#080b14]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link className="text-xs text-yellow-400 hover:underline mb-6 inline-block" href="/">
          ← Back to Top 10 Casinos
        </Link>

        <div className="glass-card rounded-3xl p-8 md:p-12 border border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🎰</span>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white">{casino.name}</h1>
                <p className="text-sm text-gray-400 mt-1">{casino.licenseLabel}</p>
              </div>
            </div>
            <span className="badge badge-gold px-4 py-2 text-sm">{badgeText}</span>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed mb-8">{casino.summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase">Welcome Bonus</p>
              <p className="text-lg font-bold text-gradient mt-1">{welcomeBonus}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Wagering</p>
              <p className="text-lg font-bold text-white mt-1">{wagering}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Interac Payout</p>
              <p className="text-lg font-bold text-green-400 mt-1">{withdrawal}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Min Deposit</p>
              <p className="text-lg font-bold text-white mt-1">{minDeposit}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Highlights &amp; Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {casino.highlights.map((h) => (
                <li className="flex items-center gap-3 text-sm text-gray-300 p-3 rounded-xl bg-white/5 border border-gray-800" key={h}>
                  <span className="text-green-400 font-bold">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Verified review updated on: {formatReviewDate(casino.verifiedAt)}
            </p>
            <a
              className="btn-primary text-base py-3 px-8 w-full sm:w-auto text-center pulse-glow"
              href={offer?.destinationUrl ?? `/go/${casino.slug}`}
              rel="noopener noreferrer nofollow sponsored"
              target="_blank"
            >
              Play at {casino.name} →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
