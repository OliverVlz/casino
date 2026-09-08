import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { GamblingCasinoExtended } from '@/lib/types'

interface CasinoCardProps {
  casino: GamblingCasinoExtended
  ranking: number
}

export const CasinoCard: React.FC<CasinoCardProps> = ({ casino, ranking }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden mb-5">
      
      {/* Top Banner / Badge if applicable */}
      {casino.badges && casino.badges.length > 0 && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-1.5 flex items-center justify-between text-xs font-bold text-white border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">★</span>
            <span className="text-amber-300">{casino.badges[0]}</span>
          </div>
          <span className="text-white/60 font-normal">Rank #{ranking} in Canada</span>
        </div>
      )}

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Ranking, Logo & Review Link */}
        <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-between md:justify-center text-center gap-3">
          <div className="flex items-center gap-3 md:flex-col">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-black text-gray-700 text-sm">
              {ranking}
            </div>
            
            <div className="relative w-32 h-16 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100 shadow-inner">
              <Image
                src={casino.logoUrl}
                alt={casino.name}
                width={120}
                height={50}
                className="max-h-12 w-auto object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="text-left md:text-center">
            <div className="text-xs text-gray-500">Launched in {casino.establishedYear}</div>
            <Link 
              href={`/casino/${casino.slug}`}
              className="text-xs font-bold text-[#0157ff] hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>{casino.name} Review</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Center Column: Bonus Details & Highlights */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg text-amber-900 font-extrabold text-sm">
              ★ {casino.rating.toFixed(1)} / 5.0
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Min Deposit: {casino.minDeposit}
            </span>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Payout: {casino.payoutSpeed}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug">
              {casino.bonusDescription}
            </h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {casino.summary}
            </p>
          </div>

          {/* Key Bullet Highlights */}
          {casino.highlights && (
            <div className="flex flex-wrap gap-2 pt-1">
              {casino.highlights.map((item, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-md">
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: CTA & Supported Payment Icons */}
        <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center gap-3">
          <a
            href={`/go/${casino.slug}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full text-center button-blue-v2 uppercase tracking-wide font-black text-sm py-3.5 px-6"
          >
            Visit Site →
          </a>

          {/* Supported Payments */}
          <div className="flex flex-wrap justify-center md:justify-end gap-1.5 pt-1">
            {casino.paymentMethods.slice(0, 5).map((method, index) => (
              <span 
                key={index}
                className="text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded"
              >
                {method}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer hover:text-gray-900">
            <input type="checkbox" id={`compare-${casino.slug}`} className="rounded border-gray-300 text-[#0157ff] focus:ring-0" />
            <label htmlFor={`compare-${casino.slug}`} className="cursor-pointer text-[11px]">Add to comparison</label>
          </div>
        </div>

      </div>

      {/* Terms & Conditions Footer Strip */}
      <div className="bg-[#fcfcfc] border-t border-gray-100 px-4 sm:px-6 py-2 text-[11px] text-gray-500">
        <span>{casino.termsSummary}</span>
      </div>

    </div>
  )
}
