'use client'

import React, { useMemo } from 'react'
import { Hero } from '@/components/Hero'
import { InteractiveCasinoFinder } from '@/components/InteractiveCasinoFinder'
import { FreePlayRewardsSection } from '@/components/FreePlayRewardsSection'
import { NewsSection } from '@/components/NewsSection'
import type { SnapshotCasino } from '@casino/contracts'
import { parseGamblingCasino } from '@/lib/types'

interface HomeClientProps {
  initialCasinos: SnapshotCasino[]
}

export const HomeClient: React.FC<HomeClientProps> = ({ initialCasinos }) => {
  const parsedCasinos = useMemo(() => {
    return initialCasinos.map(parseGamblingCasino)
  }, [initialCasinos])

  return (
    <div>
      {/* Hero */}
      <Hero />

      {/* Main Content Area with 3-Clicks Interactive Casino Finder */}
      <div id="casino-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Affiliate Disclosure Notice */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 mb-8 flex items-center justify-between text-xs text-blue-950">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#0157ff]">ℹ Affiliate Disclosure:</span>
            <span>
              We review and recommend licensed casino operators. When you register via our links, we may earn an affiliate commission at zero cost to you.
            </span>
          </div>
          <span className="hidden md:inline-block font-bold text-gray-500">19+ Only</span>
        </div>

        {/* Interactive Casino Finder with Filters & Scroll in Y */}
        <InteractiveCasinoFinder casinos={parsedCasinos} />

      </div>

      {/* Free Play Rewards Section */}
      <FreePlayRewardsSection />

      {/* News Section */}
      <NewsSection />
    </div>
  )
}
