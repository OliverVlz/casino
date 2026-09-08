'use client'

import React, { useState } from 'react'

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What is the best online casino welcome bonus in Canada for September 2026?',
      a: 'For September 2026, our top-rated welcome bonus is Wild Tornado (500% match up to $5,000 + 500 Free Spins on Bonanza Billion), followed by Lucky Ones ($20,000 package + 500 Spins) and Magicianbet (333% match up to $5,000). These offers were chosen for their balanced wagering ratios and high maximum bonus ceilings.'
    },
    {
      q: 'What does "wagering requirement" or "rollover" mean?',
      a: 'Wagering requirement (e.g. 40x) is the multiplier that represents the total amount of money you must bet before your bonus funds and associated winnings can be converted into withdrawable cash. For example, a $100 bonus with 40x wagering requires $4,000 in total bets.'
    },
    {
      q: 'Are casino winnings taxable in Canada?',
      a: 'In Canada, gambling winnings are completely tax-free for recreational players because the CRA (Canada Revenue Agency) classifies gambling returns as windfalls rather than regular earned income.'
    },
    {
      q: 'Can I deposit and withdraw using Interac in Canadian casinos?',
      a: 'Yes, Interac is the gold standard banking method for Canadian players, offering instant bank-level security, zero fees, and payouts typically processed within 1 to 24 hours.'
    },
    {
      q: 'What is the difference between deposit-only wagering and deposit+bonus wagering?',
      a: 'Deposit-only (or bonus-only) wagering is significantly more player-friendly. If an offer is 40x on the bonus, you only multiply the bonus amount. If an offer is 40x on (Deposit + Bonus), you must wager double the volume to clear the same bonus cash.'
    }
  ]

  return (
    <div id="anchor_faq" className="space-y-4 mb-16">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <span className="text-xs font-bold text-[#0157ff] uppercase tracking-widest">Got Questions?</span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Online Casino Bonus FAQ
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-gray-900 hover:text-[#0157ff] transition-colors gap-4"
            >
              <span className="text-base">{faq.q}</span>
              <span className="text-xl font-black text-gray-400">
                {openIndex === idx ? '−' : '+'}
              </span>
            </button>

            {openIndex === idx && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
