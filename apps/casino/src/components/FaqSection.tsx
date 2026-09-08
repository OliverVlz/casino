'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Which online casino is best for Canadian players?',
    a: 'Spin Casino and Jackpot City are our top picks for Canadian players, offering full Interac support, CAD transactions, and trusted Kahnawake licenses since 2001 and 1998 respectively. For Ontario residents, LeoVegas, bet365, and BetMGM Ontario offer iGaming Ontario licensed play with strong player protections.',
  },
  {
    q: 'Can I use Interac e-Transfer at online casinos?',
    a: 'Yes — all 10 casinos on our list support Interac e-Transfer for both deposits and withdrawals. Deposits are instant. Withdrawals typically take 1–3 business days. Interac e-Transfer is the most popular payment method for Canadian casino players due to zero fees and CAD transactions.',
  },
  {
    q: 'What is iGaming Ontario and do I need an Ontario-licensed casino?',
    a: 'iGaming Ontario (iGO) is the regulatory framework for Ontario’s legal online gambling market, launched in April 2022. Ontario residents are not required to use iGO-licensed casinos, but doing so provides the strongest player protections — including segregated funds, mandatory responsible gambling tools, and AGCO dispute resolution.',
  },
  {
    q: 'Is online gambling legal in Canada?',
    a: 'Online gambling is legal for Canadian players at offshore-licensed casinos (MGA, Kahnawake, Gibraltar). Ontario is the only province with a fully competitive regulated market via iGaming Ontario. Canadian players are never prosecuted for playing at licensed offshore casinos.',
  },
  {
    q: 'What is the minimum deposit at Canadian online casinos?',
    a: 'Most Canadian online casinos accept C$10 as a minimum deposit via Interac e-Transfer. BetMGM Ontario and LeoVegas require C$10. Casumo and 888Casino require C$20. All bonuses on our list are denominated in Canadian dollars.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-[#0d1221] border-t border-gray-800 py-16" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                className="glass-card rounded-2xl p-6 transition-all duration-200 cursor-pointer"
                key={faq.q}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-white font-semibold text-lg">{faq.q}</h3>
                  <span className="text-yellow-400 font-bold text-xl">
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p className="text-gray-400 text-sm leading-relaxed mt-4 pt-4 border-t border-gray-800">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
