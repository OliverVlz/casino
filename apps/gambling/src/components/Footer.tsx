import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0C0000] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-1 text-2xl font-black text-white no-underline">
              <span>GAMBLING</span>
              <span className="text-[#e8121a]">.COM</span>
            </Link>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              Gambling.com is the leading authority on online casinos, sports betting, and bonus promotions. Empowering players since 2006 with honest data, deep industry expertise, and verified safe operators.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-block bg-[#181818] border border-white/20 text-xs px-3 py-1 rounded-full font-bold text-amber-400">
                19+ Only
              </span>
              <span className="inline-block bg-[#181818] border border-white/20 text-xs px-3 py-1 rounded-full font-bold text-white/80">
                SSL 256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Casino Guides</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/" className="hover:text-[#e8121a] transition-colors">Top Online Casinos</Link></li>
              <li><Link href="/bonuses" className="hover:text-[#e8121a] transition-colors">September 2026 Bonuses</Link></li>
              <li><Link href="/bonuses#anchor_bonus_spécifique_jeu" className="hover:text-[#e8121a] transition-colors">Free Spins Deals</Link></li>
              <li><Link href="/bonuses#anchor_conditions_générales_bonus_casino" className="hover:text-[#e8121a] transition-colors">Wagering Requirements</Link></li>
              <li><Link href="/" className="hover:text-[#e8121a] transition-colors">Fast Payout Casinos</Link></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Payment Options</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/#casino-directory" className="hover:text-[#e8121a] transition-colors">Interac Online Casinos</Link></li>
              <li><Link href="/#casino-directory" className="hover:text-[#e8121a] transition-colors">Crypto & Bitcoin Sites</Link></li>
              <li><Link href="/#casino-directory" className="hover:text-[#e8121a] transition-colors">PayPal & E-Wallets</Link></li>
              <li><Link href="/#casino-directory" className="hover:text-[#e8121a] transition-colors">Apple Pay & Google Pay</Link></li>
              <li><Link href="/#casino-directory" className="hover:text-[#e8121a] transition-colors">$1 Min Deposit Casinos</Link></li>
            </ul>
          </div>

          {/* Corporate / Responsible */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Editorial & Trust</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/bonuses" className="hover:text-[#e8121a] transition-colors">About Our Experts</Link></li>
              <li><Link href="/bonuses" className="hover:text-[#e8121a] transition-colors">Editorial Guidelines</Link></li>
              <li><Link href="/bonuses" className="hover:text-[#e8121a] transition-colors">Responsible Gambling Policy</Link></li>
              <li><Link href="/bonuses" className="hover:text-[#e8121a] transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/bonuses" className="hover:text-[#e8121a] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Responsible Gaming Warning */}
        <div className="py-8 border-b border-white/10 text-xs text-white/60 space-y-3">
          <p className="font-bold text-white/80">
            DISCLAIMER & AFFILIATE DISCLOSURE:
          </p>
          <p className="leading-relaxed">
            At Gambling.com, we strive to ensure players find the exact casino and betting offers suited to their preferences. Some of the links on this site are affiliate links, which means if you click through and make a deposit, we may receive a commission at no additional cost to you.
          </p>
          <p className="leading-relaxed">
            Gambling can be addictive. Please play responsibly. If you or someone you know has a gambling problem, crisis counselling and support services can be accessed at ConnexOntario (1-866-531-2600) or Responsible Gambling Council Canada.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <div>
            © 2006 - 2026 Gambling.com. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Cookie Settings</span>
            <span>•</span>
            <span>Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
