import React from 'react'
import Link from 'next/link'

interface BonusItem {
  name: string
  slug: string
  bonus: string
  wagering: string
  validity: string
  rating: number
  logo: string
}

export const BonusComparisonTable: React.FC = () => {
  const bonuses: BonusItem[] = [
    {
      name: 'Jet4Bet',
      slug: 'jet4bet',
      bonus: '350% up to $22,500 + 350 Free Spins',
      wagering: '50x bonus only',
      validity: '7 days (bonus) / 72h (spins)',
      rating: 9.8,
      logo: 'https://objects.kaxmedia.com/auto/o/212506/f71cd5ee2a.png'
    },
    {
      name: 'Lucky Ones',
      slug: 'lucky-ones',
      bonus: '325% up to $20,000 + 500 Free Spins',
      wagering: '40x bonus only',
      validity: '7 days',
      rating: 9.7,
      logo: 'https://objects.kaxmedia.com/auto/o/212506/f71cd5ee2a.png'
    },
    {
      name: 'Wild Tornado',
      slug: 'wild-tornado',
      bonus: '500% up to $5,000 + 500 Free Spins',
      wagering: '40x bonus only',
      validity: '3 days per tier',
      rating: 9.6,
      logo: 'https://objects.kaxmedia.com/auto/o/215521/4aa4907191.png'
    },
    {
      name: 'Stake.com',
      slug: 'stake-com',
      bonus: '200% up to $1,400 Exclusive Crypto Deal',
      wagering: '40x wagering',
      validity: '30 days',
      rating: 9.6,
      logo: 'https://objects.kaxmedia.com/auto/o/275014/fcfba37465.png'
    },
    {
      name: 'Casimba',
      slug: 'casimba',
      bonus: '200% up to $5,000 + 50 Free Spins',
      wagering: '35x playthrough',
      validity: '30 days',
      rating: 9.4,
      logo: 'https://objects.kaxmedia.com/auto/o/215294/19e7f05e14.png'
    },
    {
      name: '7Bit Casino',
      slug: '7bit',
      bonus: '325% up to $10,800 + 250 Free Spins',
      wagering: '40x bonus',
      validity: '14 days',
      rating: 9.3,
      logo: 'https://objects.kaxmedia.com/auto/o/235708/72ed6d6ae2.png'
    },
    {
      name: 'Magicianbet',
      slug: 'magicianbet',
      bonus: '333% up to $5,000 + 500 Free Spins',
      wagering: '35x rollover',
      validity: '10 days',
      rating: 9.3,
      logo: 'https://objects.kaxmedia.com/auto/o/284401/a3e10d63e0.png'
    },
    {
      name: 'Lucky Nugget',
      slug: 'lucky-nugget',
      bonus: '25 Free Spins for only $1 Min Deposit',
      wagering: '200x on spins',
      validity: '7 days',
      rating: 9.1,
      logo: 'https://objects.kaxmedia.com/auto/o/223863/dfc8dfe74d.png'
    }
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#e8121a] uppercase tracking-widest">
            Detailed Comparison Table
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Top September 2026 Welcome Bonuses Ranked
          </h3>
        </div>
        <span className="text-xs bg-white/10 text-white/90 border border-white/20 px-3 py-1.5 rounded-full font-semibold">
          Updated: Sept 1, 2026
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              <th className="py-4 px-6">Casino</th>
              <th className="py-4 px-6">Welcome Bonus Package</th>
              <th className="py-4 px-6">Wagering (Rollover)</th>
              <th className="py-4 px-6">Validity</th>
              <th className="py-4 px-6">Rating</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bonuses.map((item, index) => (
              <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-950">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-600 font-black">
                      {index + 1}
                    </span>
                    <Link href={`/casino/${item.slug}`} className="hover:text-[#0157ff] text-gray-900 hover:underline">
                      {item.name}
                    </Link>
                  </div>
                </td>
                <td className="py-4 px-6 font-extrabold text-gray-900 text-sm">
                  {item.bonus}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-0.5 rounded-md font-bold">
                    {item.wagering}
                  </span>
                </td>
                <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                  {item.validity}
                </td>
                <td className="py-4 px-6">
                  <span className="font-black text-[#0157ff] text-base">
                    ★ {item.rating}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <a
                    href={`/go/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-block bg-[#0157ff] hover:bg-[#0045cc] text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Claim Offer
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
        * Always check specific game weighting percentages and deposit method exclusions before claiming any casino promotion.
      </div>
    </div>
  )
}
