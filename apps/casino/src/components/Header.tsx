import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center gap-2 group" href="/">
            <span className="text-3xl">🎰</span>
            <span className="text-xl font-bold text-gradient">BestCasinoRanker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              href="/#top10"
            >
              Top 10
            </Link>
            <Link
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              href="#interac"
            >
              Interac Casino
            </Link>
            <Link
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              href="#ontario"
            >
              Ontario
            </Link>
            <Link
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              href="#bonuses"
            >
              Bonuses
            </Link>
            <Link
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              href="#guides"
            >
              Guides
            </Link>
            <Link
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              href="#faq"
            >
              FAQ
            </Link>
          </nav>

          <div className="hidden md:block">
            <a className="btn-primary text-sm py-2 px-5" href="/#top10">
              See Top 10
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
