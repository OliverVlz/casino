import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSnapshot, getCasinos } from '@/lib/data'
import { parseGamblingCasino } from '@/lib/types'
import { CasinoCard } from '@/components/CasinoCard'
import { BonusComparisonTable } from '@/components/BonusComparisonTable'
import { GameBonusDirectory } from '@/components/GameBonusDirectory'
import { FaqAccordion } from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Best Online Casino Bonuses September 2026 | Gambling.com Canada',
  description: 'Complete September 2026 directory of verified online casino bonuses in Canada. Compare welcome packages, wagering requirements, free spins and low deposit deals.',
}

export default async function BonusesPage() {
  const snapshot = await getSnapshot()
  const rawCasinos = getCasinos(snapshot)
  const casinos = rawCasinos.map(parseGamblingCasino)

  return (
    <div className="bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#0157ff] hover:underline">Gambling.com</Link>
          <span>»</span>
          <Link href="/" className="hover:text-[#0157ff] hover:underline">Online Casinos</Link>
          <span>»</span>
          <span className="text-gray-900 font-bold">Best Casino Bonuses Canada September 2026</span>
        </nav>

        {/* Header Title & Editorial Meta Box */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            Best Online Casino Bonuses in Canada <span className="text-[#e8121a]">September 2026</span>
          </h1>

          {/* Author & Fact-Checker Profile */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6">
              
              {/* Written by */}
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-200 border-2 border-red-600">
                  <Image
                    src="https://www.gambling.com/cdn-cgi/image/w=72,h=72,format=webp/https://objects.kaxmedia.com/auto/o/61509/e973e0a982.png"
                    alt="Dean Ryan"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Written by</div>
                  <div className="text-sm font-bold text-gray-900">Dean Ryan</div>
                  <div className="text-[11px] text-gray-500">Casino Strategy Lead (15+ yrs exp)</div>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-gray-200" />

              {/* Fact checked by */}
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-600">
                  <Image
                    src="https://www.gambling.com/cdn-cgi/image/w=72,h=72,format=webp/https://objects.kaxmedia.com/auto/o/185546/910e160d1e.png"
                    alt="Sarah Azzopardi"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Fact Checked by</div>
                  <div className="text-sm font-bold text-gray-900">Sarah Azzopardi</div>
                  <div className="text-[11px] text-gray-500">Regulatory & Verification Analyst</div>
                </div>
              </div>

            </div>

            {/* Last Updated Badge */}
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Updated: September 1, 2026
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Anchor Quick Navigation */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-2 mb-8 shadow-sm overflow-x-auto flex items-center gap-2">
          <a href="#anchor_bonus_bienvenue" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#0157ff] hover:text-white transition-colors text-gray-800">
            🏆 Top Welcome Deal
          </a>
          <a href="#anchor_bonus_mois" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#0157ff] hover:text-white transition-colors text-gray-800">
            📊 Comparison Table
          </a>
          <a href="#anchor_choisir" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#0157ff] hover:text-white transition-colors text-gray-800">
            🎯 How to Choose
          </a>
          <a href="#anchor_conditions_générales_bonus_casino" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#0157ff] hover:text-white transition-colors text-gray-800">
            ⚖ Wagering & Rollover
          </a>
          <a href="#anchor_bonus_spécifique_jeu" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#0157ff] hover:text-white transition-colors text-gray-800">
            🎰 Game-Specific Bonuses
          </a>
          <a href="#anchor_faq" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#0157ff] hover:text-white transition-colors text-gray-800">
            ❓ FAQ
          </a>
        </div>

        {/* Featured Editorial Review Spotlight: Wild Tornado */}
        <div id="anchor_bonus_bienvenue" className="bg-white rounded-2xl border-2 border-red-500/80 p-6 sm:p-8 mb-12 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#e8121a] text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-bl-xl">
            #1 Best Welcome Bonus September 2026
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Editor's Choice: Wild Tornado Welcome Package
            </h2>
            
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-base">🎁</span>
                <div>
                  <strong>Welcome Package:</strong> 500% Match up to $5,000 CAD + 500 Free Spins on BGaming's <em>Bonanza Billion</em> spread across your first deposits.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base">❇️</span>
                <div>
                  <strong>Wagering Conditions:</strong> 40x strictly on the bonus funds (not including deposit). Minimum deposit $30 CAD, maximum bet $5 CAD per spin.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base">💎</span>
                <div>
                  <strong>Best Ongoing Feature:</strong> Daily Tornado Mystery Boxes unlock random free spins or bonus credit drops starting from $30 deposit tiers.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base">🖋️</span>
                <div>
                  <strong>Expert Verdict:</strong> This is a massive offer, but its greatest strength is calculating rollover solely on the bonus amount rather than the combined total. It suits consistent weekly depositors looking to maximize free spins value.
                </div>
              </li>
            </ul>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="/go/wild-tornado"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="button-red-v2 uppercase tracking-wide font-black text-sm"
              >
                Claim Wild Tornado Bonus ($5,000 + 500 Spins) →
              </a>
              <Link href="/casino/wild-tornado" className="text-xs font-bold text-[#0157ff] hover:underline">
                Read Full Wild Tornado Review →
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div id="anchor_bonus_mois">
          <BonusComparisonTable />
        </div>

        {/* Top Ranked Bonus Cards */}
        <div className="space-y-6 mb-12">
          <div className="border-b border-gray-200 pb-4">
            <span className="text-xs font-bold text-[#0157ff] uppercase tracking-widest">Full Directory</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              All Verified September 2026 Casino Bonuses
            </h2>
          </div>

          {casinos.map((casino, index) => (
            <CasinoCard
              key={casino.slug}
              casino={casino}
              ranking={index + 1}
            />
          ))}
        </div>

        {/* Guide: How to Choose a Bonus */}
        <div id="anchor_choisir" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12 space-y-4">
          <span className="text-xs font-bold text-[#0157ff] uppercase tracking-widest">Buyer's Guide</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            How to Choose the Right Casino Bonus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
              <div className="text-xl">1️⃣</div>
              <h4 className="font-bold text-gray-900 text-sm">Check the Wagering Ratio</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Aim for requirements between 30x and 40x. Anything higher than 50x makes cashouts difficult to achieve.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
              <div className="text-xl">2️⃣</div>
              <h4 className="font-bold text-gray-900 text-sm">Verify Game Contributions</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                If you prefer Blackjack or Live Roulette, ensure table games contribute at least 10% to the playthrough requirement.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
              <div className="text-xl">3️⃣</div>
              <h4 className="font-bold text-gray-900 text-sm">Look at Validity Windows</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ensure you have ample time (ideally 14 to 30 days) to clear the requirements comfortably without rushing stakes.
              </p>
            </div>
          </div>
        </div>

        {/* Guide: Wagering Requirements Explained */}
        <div id="anchor_conditions_générales_bonus_casino" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12 space-y-4">
          <span className="text-xs font-bold text-[#e8121a] uppercase tracking-widest">Terms & Fine Print</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Understanding Casino Bonus Terms & Conditions
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every casino bonus comes with specific regulatory rules and promotional limits designed to protect operators while offering fair incentives.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-gray-200 p-4 rounded-xl">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Max Bet Limit While Active</h4>
              <p className="text-xs text-gray-600">
                Most Canadian casinos enforce a $5 CAD maximum bet cap per spin when playing with active bonus balances.
              </p>
            </div>
            <div className="border border-gray-200 p-4 rounded-xl">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Excluded Payment Methods</h4>
              <p className="text-xs text-gray-600">
                Deposits made via certain e-wallets (such as Skrill or Neteller) may occasionally be excluded from first deposit bonuses. Interac is always eligible.
              </p>
            </div>
          </div>
        </div>

        {/* Game-Specific Bonus Directory */}
        <GameBonusDirectory />

        {/* FAQ Accordion */}
        <FaqAccordion />

      </div>
    </div>
  )
}
