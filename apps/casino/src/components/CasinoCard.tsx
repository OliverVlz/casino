import Link from 'next/link'
import type { SnapshotCasino, SnapshotOffer } from '@casino/contracts'

interface Props {
  casinos: SnapshotCasino[]
  offers: SnapshotOffer[]
}

const cardThemes = [
  { rankColor: 'from-yellow-400 to-orange-500', bgGrad: 'from-[#0b0c10] to-[#1f2833]', accent: '#66fcf1', emoji: '🍀' },
  { rankColor: 'from-gray-300 to-gray-500', bgGrad: 'from-[#0b0c10] to-[#1f2833]', accent: '#66fcf1', emoji: '🍀' },
  { rankColor: 'from-orange-600 to-orange-800', bgGrad: 'from-[#0c0032] to-[#190062]', accent: '#6c5ce7', emoji: '🏆' },
  { rankColor: 'bg-gray-700', bgGrad: 'from-[#1a1a2e] to-[#16213e]', accent: '#e94560', emoji: '💰' },
  { rankColor: 'bg-gray-700', bgGrad: 'from-[#0f3460] to-[#16213e]', accent: '#e94560', emoji: '🏆' },
  { rankColor: 'bg-gray-700', bgGrad: 'from-[#10002b] to-[#240046]', accent: '#7b2cbf', emoji: '🃏' },
]

export function CasinoCard({
  casino,
  index,
  offer,
}: {
  casino: SnapshotCasino
  index: number
  offer?: SnapshotOffer
}) {
  const theme = cardThemes[index % cardThemes.length]
  const isTop1 = index === 0

  // Parse custom values from highlights
  const minDeposit = casino.highlights.find((h) => h.startsWith('Min Deposit'))?.replace('Min Deposit ', '') ?? 'C$10'
  const withdrawal = casino.highlights.find((h) => h.startsWith('Withdrawal:'))?.replace('Withdrawal: ', '') ?? '1–3 days via Interac'
  const wagering = casino.highlights.find((h) => h.startsWith('Wagering:'))?.replace('Wagering: ', '') ?? '35x'
  const welcomeBonus = casino.highlights.find((h) => h.startsWith('Welcome Bonus:'))?.replace('Welcome Bonus: ', '') ?? 'C$1,000 Welcome Package'
  const badgeText = casino.highlights.find((h) => h.startsWith('Badge:'))?.replace('Badge: ', '') ?? 'Verified'
  const gamesCount = casino.highlights.find((h) => h.includes('Games'))?.replace(' Games', '') ?? '500+'

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden card-hover ${
        isTop1 ? 'glow ring-2 ring-yellow-500/30' : ''
      }`}
    >
      <div className="relative">
        <div
          className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-10 ${
            theme.rankColor.startsWith('from-') ? `bg-gradient-to-br ${theme.rankColor} text-black` : 'bg-gray-700 text-gray-300'
          }`}
        >
          #{index + 1}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className="badge badge-gold">{badgeText}</span>
        </div>

        {/* HERO BANNER FOR CARD */}
        <div className={`h-36 w-full relative overflow-hidden bg-gradient-to-br ${theme.bgGrad}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl mb-2 drop-shadow-lg">{theme.emoji}</span>
            <p className="text-white font-bold text-sm text-center px-2 truncate max-w-full">
              {casino.name}
            </p>
            <p className="text-xs opacity-60 text-white mt-1">Casino</p>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: theme.accent }} />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{casino.name}</h3>

        <div className="flex items-center gap-1">
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star-empty">★</span>
          <span className="ml-2 text-sm font-semibold text-white">
            {casino.rating?.toFixed(1) ?? '4.7'}
          </span>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Welcome Bonus</p>
          <p className="text-lg font-bold text-gradient">{welcomeBonus}</p>
          <p className="text-xs text-gray-500 mt-1">Wagering: {wagering}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Min Deposit</p>
            <p className="text-sm font-semibold text-white">{minDeposit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Withdrawal Time</p>
            <p className="text-sm font-semibold text-green-400">{withdrawal}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Games</p>
            <p className="text-sm font-semibold text-white">{gamesCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">License</p>
            <p className="text-sm font-semibold text-white truncate">{casino.licenseLabel}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-blue text-[11px]">Interac ✓</span>
          <span className="badge badge-blue text-[11px]">CAD Accepted</span>
          <span className="badge badge-blue text-[11px]">Ontario Approved</span>
        </div>

        <div className="mt-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Pros</h4>
          <ul className="space-y-1">
            {casino.highlights.slice(0, 2).map((item) => (
              <li className="flex items-start gap-2 text-xs text-gray-300" key={item}>
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <a
            className="btn-primary w-full pulse-glow"
            href={offer?.destinationUrl ?? `/go/${casino.slug}`}
            rel="noopener noreferrer nofollow sponsored"
            target="_blank"
          >
            Visit {casino.name} →
          </a>
          <Link className="btn-secondary w-full text-sm" href={`/casino/${casino.slug}`}>
            Read Review
          </Link>
        </div>
      </div>
    </div>
  )
}
