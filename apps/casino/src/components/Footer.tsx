import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#080b14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍁</span>
              <span className="text-lg font-bold text-gradient">BestCasinoRanker</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Canada&apos;s most trusted casino ranking site. We compare licensed online casinos for Canadian players — Interac, CAD bonuses, and iGaming Ontario verified.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Top Lists</h3>
            <ul className="space-y-2">
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="/#top10">Best Casinos Canada</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#interac">Interac Casino</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#ontario">Ontario Casinos</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#bonuses">CAD Casino Bonuses</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#guides">Fast Withdrawal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Bonuses</h3>
            <ul className="space-y-2">
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#bonuses">Casino Bonuses Canada</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#top10">No Deposit Bonus</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#top10">New Casinos 2026</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#guides">All Guides →</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#ontario">iGaming Ontario Guide</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#guides">Our Methodology</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#responsible">Responsible Gambling</Link></li>
              <li><Link className="text-sm text-gray-400 hover:text-yellow-400 transition-colors" href="#faq">FAQ &amp; Support</Link></li>
            </ul>
          </div>

          <div id="responsible">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Gamble Responsibly</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 font-bold text-sm">19+</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Gambling involves risk. Only play with money you can afford to lose.</p>
              </div>
            </div>
            <div className="space-y-1">
              <a className="text-xs text-yellow-400 hover:underline block" href="https://www.connexontario.ca" rel="noopener noreferrer" target="_blank">
                ConnexOntario (Problem Gambling) →
              </a>
              <a className="text-xs text-yellow-400 hover:underline block" href="https://www.responsiblegambling.org" rel="noopener noreferrer" target="_blank">
                ResponsibleGambling.org →
              </a>
              <a className="text-xs text-yellow-400 hover:underline block" href="https://www.camh.ca" rel="noopener noreferrer" target="_blank">
                CAMH Problem Gambling →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            <strong className="text-gray-400">Affiliate Disclosure:</strong> BestCasinoRanker is an independent comparison and affiliate website. We earn a commission when you register through our links, at no extra cost to you. Our rankings are based on independent testing and are not influenced by affiliate relationships. All casinos listed hold valid gaming licenses. Gambling should be treated as entertainment — never as a source of income. Age restriction 19+ in most Canadian provinces (18+ in Alberta, Manitoba, and Quebec).
          </p>
          <p className="text-xs text-gray-500 mb-2">
            iGaming Ontario is the market conduct organization for Ontario&apos;s competitive online gambling market, operating under the AGCO. Casinos marked with &quot;iGaming Ontario ✓&quot; are registered operators under this framework.
          </p>
          <p className="text-xs text-gray-600">© 2026 BestCasinoRanker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
