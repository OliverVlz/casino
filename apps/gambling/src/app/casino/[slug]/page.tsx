import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSnapshot, getCasino } from '@/lib/data'
import { parseGamblingCasino } from '@/lib/types'

interface ReviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const rawCasino = getCasino(snapshot, slug)
  if (!rawCasino) return { title: 'Casino Review Not Found | Gambling.com' }
  const casino = parseGamblingCasino(rawCasino)

  return {
    title: `${casino.name} Review 2026 - Honest Rating & Bonus Test | Gambling.com`,
    description: `Detailed expert review of ${casino.name}. Tested payout speed, game fairness, customer support, and ${casino.bonusDescription}.`,
  }
}

export default async function CasinoReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const rawCasino = getCasino(snapshot, slug)

  if (!rawCasino) notFound()
  const casino = parseGamblingCasino(rawCasino)

  return (
    <div className="bg-[#f8f9fa] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#0157ff] hover:underline">Gambling.com</Link>
          <span>»</span>
          <Link href="/" className="hover:text-[#0157ff] hover:underline">Casinos</Link>
          <span>»</span>
          <span className="text-gray-900 font-bold">{casino.name} Review</span>
        </nav>

        {/* Hero Header Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-16 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-200 shadow-inner">
                <Image
                  src={casino.logoUrl}
                  alt={casino.name}
                  width={110}
                  height={50}
                  className="max-h-12 w-auto object-contain"
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  {casino.name} Review 2026
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>Launched in {casino.establishedYear}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">Verified Licensed Operator</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-400 font-bold uppercase">Expert Score</div>
                <div className="text-3xl font-black text-[#0157ff]">
                  ★ {casino.rating.toFixed(1)}<span className="text-sm text-gray-400">/5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Exclusive Welcome Offer
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {casino.bonusDescription}
              </h3>
              <p className="text-xs text-white/70 mt-1">
                {casino.termsSummary}
              </p>
            </div>
            <a
              href={`/go/${casino.slug}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="button-red-v2 uppercase font-black text-sm whitespace-nowrap"
            >
              Claim Bonus Now →
            </a>
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="text-[11px] text-gray-500 uppercase font-bold">Min Deposit</div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5">{casino.minDeposit}</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="text-[11px] text-gray-500 uppercase font-bold">Payout Speed</div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5">{casino.payoutSpeed}</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="text-[11px] text-gray-500 uppercase font-bold">Jurisdiction</div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5">{casino.licenseLabel}</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="text-[11px] text-gray-500 uppercase font-bold">Canadian Dollar (CAD)</div>
              <div className="text-sm font-extrabold text-emerald-700 mt-0.5">Fully Supported</div>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50/50 border border-emerald-200 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <span>👍</span> What We Like
            </h3>
            <ul className="space-y-2 text-xs text-emerald-900">
              {casino.pros?.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50/50 border border-red-200 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-red-950 flex items-center gap-2">
              <span>👎</span> What Could Be Improved
            </h3>
            <ul className="space-y-2 text-xs text-red-900">
              {casino.cons?.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Banking Methods */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-950">
            Supported Deposit & Withdrawal Methods
          </h3>
          <div className="flex flex-wrap gap-2">
            {casino.paymentMethods.map((method, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-800 font-bold text-xs px-3.5 py-1.5 rounded-lg border border-gray-200"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-6">
          <a
            href={`/go/${casino.slug}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="button-blue-v2 uppercase font-black text-base py-4 px-10 shadow-xl"
          >
            Visit {casino.name} & Claim Bonus →
          </a>
        </div>

      </div>
    </div>
  )
}
