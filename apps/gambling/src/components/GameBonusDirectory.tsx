import React from 'react'

export const GameBonusDirectory: React.FC = () => {
  const categories = [
    {
      title: '🎰 Online Slots Bonuses',
      desc: 'Free spins, high RTP deposit match promos, and tournament drops tailored specifically for video slots and Megaways titles.',
      examples: [
        { label: 'Wild Tornado Bonanza Spins', value: '500 Free Spins on Bonanza Billion' },
        { label: 'Magicianbet Triple Match', value: '333% up to $5,000 + 500 Spins' },
        { label: 'SlotRave Megaways Bonus', value: '400% up to $5,000 + 150 Spins' }
      ],
      tip: 'Slots typically contribute 100% towards wagering requirements.'
    },
    {
      title: '♠️ Live Dealer & Table Game Bonuses',
      desc: 'Special cashbacks and dedicated chips for Evolution and Pragmatic Live Blackjack, Roulette, Baccarat, and Game Shows.',
      examples: [
        { label: 'Stake.com Live Rewards', value: '200% match usable on live tables' },
        { label: 'PartyCasino Live Cashback', value: 'Weekly 10% rebate on live roulette' },
        { label: 'Casimba High Roller Chips', value: 'Dedicated VIP live dealer table limits' }
      ],
      tip: 'Live dealer games usually contribute between 5% to 20% toward wagering.'
    },
    {
      title: '🎁 No Deposit & Low Minimum Deposit Bonuses',
      desc: 'Offers that let you test real money casino gameplay with minimal risk, starting from as little as $1 CAD.',
      examples: [
        { label: 'Lucky Nugget $1 Promo', value: '25 Free Spins for only $1 Min Deposit' },
        { label: 'Cosmo Spins Daily', value: '10 Free Spins Daily (No Deposit required)' },
        { label: 'LevelUp Spin Drop', value: '35 Free Spins on registration' }
      ],
      tip: 'Watch out for maximum cashout ceilings on zero-deposit promos (often capped at $100-$500).'
    },
    {
      title: '💎 VIP Loyalty & High Roller Programs',
      desc: 'Tiered VIP clubs featuring personal account managers, bespoke withdrawal limits, luxury rewards, and lower playthrough requirements.',
      examples: [
        { label: 'Casino Rewards Network', value: '16 connected operators sharing VIP loyalty points' },
        { label: 'Lucky Ones VIP Lounge', value: 'High roller tiers up to $20,000 bonus cash' },
        { label: 'HellSpin Hall of Flame', value: 'Monthly cash rewards and gadget giveaways' }
      ],
      tip: 'High roller packages often feature reduced wagering ratios (e.g. 30x instead of 40x).'
    }
  ]

  return (
    <div id="anchor_bonus_spécifique_jeu" className="space-y-8 mb-12">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold text-[#0157ff] uppercase tracking-widest">
          Game-Specific Bonus Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Bonuses Tailored by Game Category
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Different games require different bonus terms. Below is our expert breakdown of how bonus types perform across various gaming verticals in Canada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-[#0157ff]/40 transition-all space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                {cat.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                {cat.desc}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Top Recommended Offers:</div>
              {cat.examples.map((ex, exIdx) => (
                <div key={exIdx} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800">{ex.label}</span>
                  <span className="font-bold text-[#0157ff] text-right">{ex.value}</span>
                </div>
              ))}
            </div>

            <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-lg flex items-center gap-2">
              <span className="font-black">💡 Expert Tip:</span>
              <span className="text-[11px] leading-tight">{cat.tip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
