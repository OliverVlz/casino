const guides = [
  {
    category: 'Payments',
    title: 'How to Use Interac at Online Casinos in Canada',
    desc: 'Step-by-step guide to depositing and withdrawing with Interac and Interac e-Transfer at licensed Canadian online casinos.',
    readTime: '5 min read',
  },
  {
    category: 'Legal',
    title: 'Is Online Gambling Legal in Canada? 2026 Guide',
    desc: 'A complete guide to Canadian gambling laws, provincial regulation, and what iGaming Ontario means for players.',
    readTime: '7 min read',
  },
  {
    category: 'Legal',
    title: 'iGaming Ontario Explained — What Players Need to Know',
    desc: 'What is iGaming Ontario, which casinos are licensed, and why it matters for Canadian players in 2026.',
    readTime: '6 min read',
  },
  {
    category: 'Bonuses',
    title: 'Wagering Requirements Explained for Canadian Players',
    desc: 'How casino wagering requirements work, what is fair vs unfair, and how to calculate your real bonus value.',
    readTime: '5 min read',
  },
  {
    category: 'Payments',
    title: 'Fastest Withdrawal Casinos in Canada 2026 — Ranked',
    desc: 'Ranked by actual tested withdrawal times. Which casinos pay out fastest via Interac e-Transfer in Canada.',
    readTime: '4 min read',
  },
  {
    category: 'Bonuses',
    title: 'Best Casino Bonuses in Canada 2026 — Complete Guide',
    desc: 'All bonus types explained: welcome bonuses, no deposit offers, free spins, cashback and VIP in Canada.',
    readTime: '8 min read',
  },
]

const news = [
  {
    badge: 'Regulation',
    title: 'iGaming Ontario Grows to 50+ Licensed Operators in 2026',
    desc: 'The Ontario regulated market continues its rapid expansion with new operators receiving licenses in Q1 2026.',
    date: '2026-04-15',
  },
  {
    badge: 'Payments',
    title: 'Interac e-Transfer Limits Increased — What Casino Players Need to Know',
    desc: 'Major Canadian banks have raised Interac e-Transfer daily limits. We explain how this benefits casino players.',
    date: '2026-04-08',
  },
  {
    badge: 'New Games',
    title: 'BetMGM Ontario Launches Exclusive MGM Grand Slots',
    desc: 'BetMGM’s Ontario operation has added exclusive slots based on MGM’s iconic Las Vegas resort properties.',
    date: '2026-04-01',
  },
]

export function GuidesAndNewsSection() {
  return (
    <>
      <section className="bg-[#0d1221] border-t border-gray-800 py-16" id="guides">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Canadian Casino Guides</h2>
            <p className="text-gray-400 mt-1">
              Everything Canadian players need to know about online casinos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div className="glass-card rounded-2xl p-6 card-hover flex flex-col justify-between" key={guide.title}>
                <div>
                  <span className="badge badge-blue text-[10px] mb-3 inline-block">
                    {guide.category}
                  </span>
                  <h3 className="text-white font-semibold text-base mb-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{guide.desc}</p>
                </div>
                <span className="text-xs text-yellow-400 font-medium">{guide.readTime} →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="news">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Latest Canadian Casino News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div className="glass-card rounded-2xl p-6" key={item.title}>
              <span className="badge badge-blue text-[10px] mb-3 inline-block">
                {item.badge}
              </span>
              <h3 className="text-white font-semibold text-base mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{item.desc}</p>
              <p className="text-xs text-gray-600">{item.date}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
