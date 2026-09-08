'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 bg-[#0C0000] border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 no-underline text-white group">
              <div className="flex items-center font-black tracking-tight text-2xl">
                <span>GAMBLING</span>
                <span className="text-[#e8121a]">.COM</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm font-semibold text-white/90 hover:text-[#e8121a] transition-colors py-2 border-b-2 border-transparent hover:border-[#e8121a]"
              >
                Top Casinos
              </Link>
              <Link 
                href="/bonuses" 
                className="text-sm font-semibold text-white/90 hover:text-[#e8121a] flex items-center gap-1.5 transition-colors py-2 border-b-2 border-transparent hover:border-[#e8121a]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8121a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8121a]"></span>
                </span>
                September Bonuses & Forum
              </Link>
              <Link 
                href="/#free-play" 
                className="text-sm font-semibold text-white/90 hover:text-[#e8121a] transition-colors py-2 border-b-2 border-transparent hover:border-[#e8121a]"
              >
                Free Games
              </Link>
              <Link 
                href="/#news" 
                className="text-sm font-semibold text-white/90 hover:text-[#e8121a] transition-colors py-2 border-b-2 border-transparent hover:border-[#e8121a]"
              >
                Industry News
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-4">
            
            {/* Rewards Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-[#1c1c1c] border border-white/15 px-3 py-1.5 rounded-full text-xs font-bold text-white/90 hover:border-amber-400/50 transition-colors">
              <span className="inline-block w-4 h-4 rounded-full bg-amber-400 text-black text-center leading-4 text-[10px]">★</span>
              <span>Rewards Club</span>
            </div>

            {/* Region / Flag Selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md text-white/80">
              <span className="text-base leading-none">🇨🇦</span>
              <span>CA (EN)</span>
            </div>

            {/* Search Trigger */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Search Dropdown */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search 1,000+ online casinos, bonuses, free spins, games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181818] border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0157ff] focus:ring-1 focus:ring-[#0157ff]"
                autoFocus
              />
              <svg className="w-5 h-5 absolute left-3 top-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C0000] border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/5 hover:text-[#e8121a]"
          >
            Top Casinos
          </Link>
          <Link
            href="/bonuses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#e8121a] hover:bg-white/5 flex items-center justify-between"
          >
            <span>September Bonuses & Forum</span>
            <span className="text-xs bg-[#e8121a]/20 text-[#e8121a] px-2 py-0.5 rounded-full">Updated</span>
          </Link>
          <Link
            href="/#free-play"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
          >
            Free Play & Rewards
          </Link>
          <Link
            href="/#news"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
          >
            Latest News
          </Link>
        </div>
      )}
    </header>
  )
}
