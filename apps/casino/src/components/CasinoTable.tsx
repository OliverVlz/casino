import Link from 'next/link'
import type { SnapshotCasino, SnapshotOffer } from '@casino/contracts'

interface Props {
  casinos: SnapshotCasino[]
  offers: SnapshotOffer[]
}

export function CasinoTable({ casinos, offers }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="top10">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">All 10 Casinos Compared</h2>
        <p className="text-gray-400 mt-1">
          Full comparison of bonuses, wagering, Interac support, and Ontario licensing
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="casino-table w-full rounded-2xl overflow-hidden">
          <thead>
            <tr>
              <th className="rounded-tl-2xl">#</th>
              <th>Casino</th>
              <th>Bonus</th>
              <th>Wagering</th>
              <th>Withdrawal</th>
              <th>Games</th>
              <th>Rating</th>
              <th className="rounded-tr-2xl text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {casinos.map((casino, idx) => {
              const offer = offers.find((o) => o.casinoSlug === casino.slug)
              const wagering =
                casino.highlights
                  .find((h) => h.startsWith('Wagering:'))
                  ?.replace('Wagering: ', '') ?? '35x'
              const welcomeBonus =
                casino.highlights
                  .find((h) => h.startsWith('Welcome Bonus:'))
                  ?.replace('Welcome Bonus: ', '') ?? 'Welcome Bonus'
              const withdrawal =
                casino.highlights
                  .find((h) => h.startsWith('Withdrawal:'))
                  ?.replace('Withdrawal: ', '') ?? '1–3 days via Interac'
              const gamesCount =
                casino.highlights.find((h) => h.includes('Games'))?.replace(' Games', '') ??
                '500+'
              const badge =
                casino.highlights
                  .find((h) => h.startsWith('Badge:'))
                  ?.replace('Badge: ', '') ?? 'Verified'

              const isTop = idx === 0

              return (
                <tr className={`card-hover ${isTop ? 'bg-yellow-500/5' : ''}`} key={casino.slug}>
                  <td data-label="Rank">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        idx === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black'
                          : idx === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
                            : idx === 2
                              ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white'
                              : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </td>
                  <td data-label="Casino">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-white text-base">{casino.name}</p>
                        <p className="text-xs text-gray-400">{casino.licenseLabel}</p>
                        <span className="badge badge-gold text-[10px] mt-1">{badge}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Bonus">
                    <div>
                      <span className="text-gradient font-semibold text-sm">
                        {welcomeBonus}
                      </span>
                    </div>
                  </td>
                  <td data-label="Wagering">
                    <span className="text-xs font-medium text-orange-400">{wagering}</span>
                  </td>
                  <td data-label="Withdrawal">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-white text-sm">{withdrawal}</span>
                    </div>
                  </td>
                  <td data-label="Games">
                    <span className="text-white text-sm font-medium">{gamesCount}</span>
                  </td>
                  <td data-label="Rating">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold text-white">
                        {casino.rating?.toFixed(1) ?? '4.5'}
                      </span>
                    </div>
                  </td>
                  <td data-label="Action">
                    <div className="flex flex-col gap-2 items-end">
                      <a
                        className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                        href={offer?.destinationUrl ?? `/go/${casino.slug}`}
                        rel="noopener noreferrer nofollow sponsored"
                        target="_blank"
                      >
                        Play Now →
                      </a>
                      <Link
                        className="text-xs text-yellow-400 hover:underline text-center w-full"
                        href={`/casino/${casino.slug}`}
                      >
                        Review
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
