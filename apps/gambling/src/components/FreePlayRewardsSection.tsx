import React from 'react'
import Image from 'next/image'

export const FreePlayRewardsSection: React.FC = () => {
  const games = [
    {
      title: 'Cosmo Spins',
      badge: '10 Free Spins Daily',
      image: 'https://objects.kaxmedia.com/auto/o/285537/aa978feeee.webp',
      link: '/bonuses#anchor_bonus_bienvenue',
      desc: 'No deposit required. Spin daily to accumulate reward chips.'
    },
    {
      title: 'Free Play Slots',
      badge: '1000s of Free Games',
      image: 'https://objects.kaxmedia.com/auto/o/285538/78701db28a.png',
      link: '/bonuses#anchor_bonus_spécifique_jeu',
      desc: 'Play verified demo versions of the top online slots with real odds.'
    },
    {
      title: 'Stable Stars',
      badge: 'Fantasy Horse Racing',
      image: 'https://objects.kaxmedia.com/auto/o/285539/0e6bb36928.png',
      link: '/bonuses',
      desc: 'Build your daily stable and compete for real money prize pools.'
    },
    {
      title: 'BetBuilder AI',
      badge: 'Smart Football Tool',
      image: 'https://objects.kaxmedia.com/auto/o/285536/ca33cd778b.png',
      link: '/bonuses',
      desc: 'Algorithmic predictive builder for accumulator sports bets.'
    },
    {
      title: 'Slot Tournaments',
      badge: 'Weekly Prize Drops',
      image: 'https://objects.kaxmedia.com/auto/o/285834/22888d2b4f.png',
      link: '/bonuses',
      desc: 'Join live tournament leaderboards with zero entry fee.'
    }
  ]

  return (
    <section id="free-play" className="bg-[#0C0000] text-white py-16 border-t border-b border-white/10 relative overflow-hidden">
      {/* Glow */}
      <div 
        className="pointer-events-none absolute -right-20 top-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,18,26,0.25)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-[#e8121a] mb-2">
            Members Only • Free to Join
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Free Play. <span className="text-[#e8121a]">Real Rewards.</span>
          </h2>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            Play our free games, collect chips as you go, and redeem them for genuine prizes. No deposit, no stake, just the games you love with rewards worth playing for.
          </p>
        </div>

        {/* Carousel / Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {games.map((game, index) => (
            <a
              key={index}
              href={game.link}
              className="group bg-[#161616] rounded-2xl border border-white/10 hover:border-[#e8121a]/60 overflow-hidden shadow-xl transition-all duration-300 flex flex-col no-underline text-white"
            >
              <div className="relative h-44 w-full bg-gray-900 overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-[#e8121a] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {game.badge}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#e8121a] transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2 mt-1">
                    {game.desc}
                  </p>
                </div>
                <div className="text-xs font-bold text-[#0157ff] group-hover:text-white flex items-center gap-1 pt-2">
                  <span>Play For Free</span>
                  <span>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
