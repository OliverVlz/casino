'use client'

import React, { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { GamblingCasinoExtended } from '@/lib/types'

interface InteractiveCasinoFinderProps {
  casinos: GamblingCasinoExtended[]
}

export const InteractiveCasinoFinder: React.FC<InteractiveCasinoFinderProps> = ({ casinos }) => {
  // Filters state
  const [where, setWhere] = useState<'casino' | 'betting' | 'slots'>('casino')
  const [deposit, setDeposit] = useState<'$20+' | '$100+' | '$250+'>('$20+')
  const [typeFilter, setTypeFilter] = useState<'recommended' | 'new' | 'established'>('recommended')

  // Horizontal scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll controls
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  // Reset handler
  const handleReset = () => {
    setWhere('casino')
    setDeposit('$20+')
    setTypeFilter('recommended')
  }

  // Filter logic strictly implementing Where, Deposit, and Type
  const filteredCasinos = useMemo(() => {
    return casinos
      .filter((casino) => {
        // 1. Where Filter
        if (where === 'betting') {
          // Look for sportsbooks or betting highlights
          const isBetting = casino.highlights.some(h => h.toLowerCase().includes('bet') || h.toLowerCase().includes('sport')) ||
                            casino.name.toLowerCase().includes('bet') || 
                            casino.slug.includes('stake') || 
                            casino.slug.includes('tonybet') ||
                            casino.slug.includes('magicianbet')
          if (!isBetting) return false
        } else if (where === 'slots') {
          // Look for slots bonuses or free spins
          const isSlots = casino.bonusDescription.toLowerCase().includes('spin') || 
                          casino.highlights.some(h => h.toLowerCase().includes('slot') || h.toLowerCase().includes('spin')) ||
                          casino.slug.includes('dragonslots') ||
                          casino.slug.includes('7bit') ||
                          casino.slug.includes('hellspin') ||
                          casino.slug.includes('wild-tornado')
          if (!isSlots) return false
        }

        // 2. Deposit Filter
        const depositNum = parseInt(casino.minDeposit.replace(/[^0-9]/g, '') || '20', 10)
        if (deposit === '$20+') {
          // Under or equal to $20 entry
          if (depositNum > 30) return false
        } else if (deposit === '$100+') {
          // Mid-tier / high value packages ($1,000 to $5,000)
          const bonusNum = parseInt(casino.bonusDescription.match(/\$([0-9,]+)/)?.[1]?.replace(/,/g, '') || '0', 10)
          if (bonusNum < 1000) return false
        } else if (deposit === '$250+') {
          // High-roller VIP packages ($4,500+)
          const bonusNum = parseInt(casino.bonusDescription.match(/\$([0-9,]+)/)?.[1]?.replace(/,/g, '') || '0', 10)
          if (bonusNum < 4500) return false
        }

        // 3. Type Filter
        if (typeFilter === 'new') {
          return casino.establishedYear >= 2024
        }
        if (typeFilter === 'established') {
          return casino.establishedYear < 2024
        }

        return true // 'recommended'
      })
      .sort((a, b) => {
        if (typeFilter === 'new') return b.establishedYear - a.establishedYear
        return b.rating - a.rating
      })
  }, [casinos, where, deposit, typeFilter])

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 mb-12 relative overflow-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:border-r border-gray-100 lg:pr-8">
          
          {/* Header & Reset Button */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Where Do You Want to Play?
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Great Offers Just <span className="font-bold text-gray-800">3 Clicks</span> Away...
              </p>
            </div>
            
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </div>

          {/* Group 1: Where */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Where :</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'casino', label: 'Casino' },
                { id: 'betting', label: 'Betting' },
                { id: 'slots', label: 'Slots' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setWhere(item.id as typeof where)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    where === item.id
                      ? 'bg-[#18181B] text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: Deposit */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Deposit :</span>
            <div className="flex flex-wrap gap-2">
              {['$20+', '$100+', '$250+'].map((val) => (
                <button
                  key={val}
                  onClick={() => setDeposit(val as typeof deposit)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    deposit === val
                      ? 'bg-[#18181B] text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Type */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Type :</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'new', label: 'New' },
                { id: 'established', label: 'Established' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTypeFilter(item.id as typeof typeFilter)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    typeFilter === item.id
                      ? 'bg-[#18181B] text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Cards Container: Horizontal Scroll (Scroll in X with < > buttons) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between px-1 text-xs text-gray-500 font-semibold">
            <span>Showing Matching Offers ({filteredCasinos.length})</span>
            
            {/* Slide Navigation Buttons < > */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleScrollLeft}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold transition-all shadow-sm hover:scale-105"
              >
                ‹
              </button>
              <button
                onClick={handleScrollRight}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold transition-all shadow-sm hover:scale-105"
              >
                ›
              </button>
            </div>
          </div>

          {/* Horizontal Scroll in X Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-gutter:stable]"
          >
            {filteredCasinos.map((casino, index) => (
              <div
                key={casino.slug}
                className="w-[280px] sm:w-[300px] flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between relative group hover:border-[#e8121a]/40"
              >
                {/* Ranking Tag on Top Left */}
                <div className="absolute top-0 left-0 bg-[#18181B] text-white text-[11px] font-black w-7 h-7 rounded-br-xl flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Card Top: Logo */}
                <div className="flex flex-col items-center justify-center text-center pt-2">
                  <div className="relative w-36 h-14 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100 mb-3 shadow-inner">
                    <Image
                      src={casino.logoUrl}
                      alt={casino.name}
                      width={120}
                      height={45}
                      className="max-h-10 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Card Middle: Bonus Highlight in Red Italic */}
                <div className="text-center space-y-2 my-auto py-2">
                  <h3 className="text-base font-extrabold text-gray-900 leading-snug tracking-tight">
                    <span className="text-[#e8121a] italic">{casino.bonusDescription.split(' ')[0]}</span>{' '}
                    {casino.bonusDescription.split(' ').slice(1).join(' ')}
                  </h3>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold pt-1">
                    <span>★★★★★</span>
                    <span className="text-gray-700 text-xs font-black ml-1">
                      {casino.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Play Now CTA & T&Cs */}
                <div className="pt-4 space-y-2 text-center">
                  <a
                    href={`/go/${casino.slug}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-full block bg-[#E8121A] hover:bg-[#c40f16] text-white font-extrabold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-red-600/30 uppercase tracking-wide"
                  >
                    Play Now
                  </a>
                  
                  <div>
                    <Link
                      href={`/casino/${casino.slug}`}
                      className="text-xs font-bold text-gray-600 hover:text-[#0157ff] hover:underline inline-flex items-center gap-1"
                    >
                      <span>T&Cs & Review</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="text-[10px] text-gray-400 leading-tight pt-1">
                    19+. T&C Apply. Play Responsibly. Valid for Canada players.
                  </div>
                </div>

              </div>
            ))}

            {filteredCasinos.length === 0 && (
              <div className="w-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-sm font-bold text-gray-600">No casinos matched this combination.</p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-xs text-[#0157ff] font-bold hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Category Navigation Buttons & Link to Forum /bonuses */}
      <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center space-y-4">
        <Link
          href="/bonuses"
          className="text-base font-black text-gray-950 hover:text-[#e8121a] flex items-center gap-1.5 group transition-colors"
        >
          <span>See All Casino Offers in September Forum</span>
          <span className="group-hover:translate-x-1 transition-transform text-[#e8121a]">→</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            { label: 'Casino', href: '/bonuses' },
            { label: 'Betting', href: '/bonuses' },
            { label: 'Slots', href: '/bonuses#anchor_bonus_spécifique_jeu' },
            { label: 'Poker', href: '/bonuses' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:border-gray-900 hover:text-black transition-all flex items-center gap-1"
            >
              <span>{cat.label}</span>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>

        <div className="text-[11px] text-gray-400 text-center pt-2">
          Ad. 19+. Gamble Responsibly. <Link href="/bonuses#anchor_conditions_générales_bonus_casino" className="underline hover:text-gray-600">T&Cs apply</Link>.
        </div>
      </div>

    </div>
  )
}
