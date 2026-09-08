import React from 'react'

export const Hero: React.FC = () => {
  const mediaLogos = [
    { name: 'Forbes', width: '80px', text: 'Forbes' },
    { name: 'The Washington Post', width: '135px', text: 'The Washington Post' },
    { name: 'Bloomberg', width: '130px', text: 'Bloomberg' },
    { name: 'BBC', width: '80px', text: 'BBC' },
    { name: 'THE WALL STREET JOURNAL', width: '140px', text: 'THE WALL STREET JOURNAL' },
    { name: 'CNN', width: '70px', text: 'CNN' },
    { name: 'THE TIMES', width: '120px', text: 'THE TIMES' }
  ]

  return (
    <div className="relative bg-[#0C0000] text-white overflow-hidden border-b border-white/10">
      {/* Red Glow Radial Gradients */}
      <div 
        className="pointer-events-none absolute -right-[150px] -top-[300px] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(232,18,26,0.35)_0%,rgba(232,18,26,0.08)_40%,transparent_70%)]"
        aria-hidden="true"
      />
      <div 
        className="pointer-events-none absolute -left-[200px] top-[100px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(232,18,26,0.25)_0%,rgba(232,18,26,0.05)_40%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/90">
              <span className="w-2 h-2 rounded-full bg-[#e8121a]"></span>
              Trusted by 5,000,000+ Players Worldwide
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none text-white">
              Smarter gambling <br />
              <span className="text-[#e8121a]">starts here.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl font-normal leading-relaxed">
              Expert tools and honest reviews to help you gamble with a plan, not a hunch. Discover verified Canadian online casinos with guaranteed payouts and fair terms.
            </p>

            {/* Hero Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-4">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#e8121a]">1,000+</div>
                <div className="text-sm font-medium text-white/70">Sites Reviewed</div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#e8121a]">20+ Years</div>
                <div className="text-sm font-medium text-white/70">Industry Experience</div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#e8121a]">100% Verified</div>
                <div className="text-sm font-medium text-white/70">Licensed Operators</div>
              </div>
            </div>
          </div>

          {/* Quick CTA Box */}
          <div className="lg:col-span-4 bg-[#141414] border border-white/15 p-6 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="text-sm font-bold text-amber-400 uppercase tracking-wide mb-1">September 2026 Highlight</div>
            <h3 className="text-xl font-bold text-white mb-2">Wild Tornado Casino</h3>
            <p className="text-sm text-white/70 mb-4">
              500% Welcome Package up to $5,000 + 500 Free Spins with 40x bonus-only rollover requirement.
            </p>
            <a 
              href="/bonuses" 
              className="w-full text-center block bg-[#e8121a] hover:bg-[#c40f16] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-red-600/30 text-sm uppercase tracking-wider"
            >
              Explore September Forum & Bonusses →
            </a>
          </div>

        </div>
      </div>

      {/* Featured In Logos Carousel Bar */}
      <div className="bg-white py-4 border-t border-b border-gray-200 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-6">
          <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
            Featured in:
          </span>
          <div className="flex flex-wrap items-center gap-6 sm:gap-12 opacity-80 font-serif font-black text-gray-800 text-sm tracking-tight">
            {mediaLogos.map((logo, index) => (
              <span key={index} className="hover:opacity-100 transition-opacity">
                {logo.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
