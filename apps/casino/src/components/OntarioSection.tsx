import type { SnapshotCasino } from '@casino/contracts'

interface Props {
  casinos: SnapshotCasino[]
}

export function OntarioSection({ casinos }: Props) {
  const ontarioCasinos = casinos.filter((c) =>
    c.highlights.some((h) => h.includes('Ontario')),
  )

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="ontario">
      <div className="glass-card rounded-3xl p-8 md:p-12 border border-yellow-500/20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge badge-gold mb-4 inline-block">🍁 Ontario Players</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              What Is iGaming Ontario?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Since April 2022, Ontario has operated a competitive regulated online gambling market. Casinos with an iGaming Ontario license operate under strict AGCO oversight — meaning player funds are protected, bonuses must be clearly disclosed, and disputes can be resolved through the Ontario regulator.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              We mark all iGaming Ontario licensed casinos clearly. For Ontario residents, we recommend prioritizing these operators for the strongest player protections available in Canada.
            </p>
            <a className="btn-secondary" href="/#top10">
              See Ontario-Licensed Casinos →
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              iGaming Ontario Licensed — Our Top Picks
            </h3>
            <div className="space-y-3">
              {ontarioCasinos.slice(0, 5).map((casino) => {
                const bonus =
                  casino.highlights
                    .find((h) => h.startsWith('Welcome Bonus:'))
                    ?.replace('Welcome Bonus: ', '') ?? 'Welcome Bonus'
                return (
                  <div
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-gray-700/60 card-hover"
                    key={casino.slug}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🦁</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{casino.name}</p>
                        <p className="text-xs text-gray-400">{bonus}</p>
                      </div>
                    </div>
                    <span className="badge badge-gold text-[10px]">iGO ✓</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
