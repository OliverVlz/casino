import React from 'react'

export const NewsSection: React.FC = () => {
  const articles = [
    {
      title: 'Top Casino Promotions in Canada: September 2026 Monthly Breakdown',
      excerpt: 'In this monthly review, our gaming analysts compare the highest value promotions, wagering requirements, and free spin deals.',
      author: 'Gabi Vinkovic',
      readTime: '11 min read',
      date: 'September 1, 2026',
      tag: 'Casino Promotions'
    },
    {
      title: 'Lucky Wins Promo: Monthly Booster for $500 Bonus Unlocked',
      excerpt: 'The latest Lucky Wins promo is live. Discover how to claim the monthly reload booster and maximize your slot returns.',
      author: 'Dean Ryan',
      readTime: '4 min read',
      date: 'September 1, 2026',
      tag: 'Exclusive Bonus'
    },
    {
      title: 'Star Entertainment & Provincial Gaming License Updates 2026',
      excerpt: 'Comprehensive report on licensing shifts, anti-money laundering frameworks, and player safety updates across North America.',
      author: 'Kevin Walsh',
      readTime: '6 min read',
      date: 'August 31, 2026',
      tag: 'Industry News'
    }
  ]

  return (
    <section id="news" className="bg-gray-50 py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#0157ff] mb-1">
              Industry Insights & Analysis
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-gray-900 tracking-tight">
              Gambling <span className="text-[#e8121a]">NEWS</span>
            </h2>
          </div>
          <p className="text-sm text-gray-600 max-w-md">
            Get the latest gambling news, regulatory updates, and expert strategy guides covering casinos, poker, and sports betting.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block bg-blue-50 text-[#0157ff] font-bold text-xs px-2.5 py-1 rounded-md">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-gray-950 leading-snug hover:text-[#0157ff] cursor-pointer transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {item.author[0]}
                  </div>
                  <span className="font-semibold text-gray-700">{item.author}</span>
                </div>
                <span>{item.readTime}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
