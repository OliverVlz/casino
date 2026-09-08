import type { SnapshotCasino, SnapshotOffer, SiteSnapshot } from '@casino/contracts'

export interface GamblingCasinoExtended {
  slug: string
  name: string
  summary: string
  licenseLabel: string
  licenseUrl: string
  verifiedAt: string
  rating: number
  highlights: string[]
  logoUrl: string
  establishedYear: number
  bonusDescription: string
  termsSummary: string
  minDeposit: string
  payoutSpeed: string
  paymentMethods: string[]
  badges: string[]
  pros: string[]
  cons: string[]
}

export function parseGamblingCasino(casino: SnapshotCasino): GamblingCasinoExtended {
  const getHighlight = (prefix: string) =>
    casino.highlights.find((h) => h.startsWith(prefix))?.replace(prefix, '').trim()

  const establishedYear = parseInt(getHighlight('Established:') || '2022', 10)
  const minDeposit = getHighlight('Min Deposit:') || '$20'
  const payoutSpeed = getHighlight('Payout:') || 'Instant - 24h'
  const bonusDescription = getHighlight('Bonus:') || casino.summary
  const termsSummary = getHighlight('Terms:') || '19+. T&Cs apply. Play responsibly.'
  const badgesRaw = getHighlight('Badges:')
  const badges = badgesRaw ? badgesRaw.split(',').map((b) => b.trim()) : ['Verified Choice']
  const paymentsRaw = getHighlight('Payments:')
  const paymentMethods = paymentsRaw
    ? paymentsRaw.split(',').map((p) => p.trim())
    : ['Interac', 'Visa', 'MasterCard', 'Bitcoin', 'PayPal']
  const prosRaw = getHighlight('Pros:')
  const pros = prosRaw
    ? prosRaw.split(';').map((p) => p.trim())
    : ['Licensed and audited RNG', 'Fast Canadian payouts', 'Massive games selection']
  const consRaw = getHighlight('Cons:')
  const cons = consRaw
    ? consRaw.split(';').map((c) => c.trim())
    : ['Wagering restrictions on select tables']

  const logoMap: Record<string, string> = {
    'lucky-ones': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/212506/f71cd5ee2a.png',
    'granawin': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/259378/a5ed041485.png',
    'hellspin': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/283724/9cb4c87077.png',
    'stake-com': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/275014/fcfba37465.png',
    'party-casino': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/217120/3e84ed3e98.png',
    'dragonslots': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/253365/d0a5b80d1d.png',
    'magicianbet': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/284401/a3e10d63e0.png',
    'wild-tornado': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/215521/4aa4907191.png',
    'gaming-club': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/202779/25563fb4e4.png',
    'lucky-nugget': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/223863/dfc8dfe74d.png',
    'casimba': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/215294/19e7f05e14.png',
    '7bit': 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/235708/72ed6d6ae2.png',
  }

  return {
    slug: casino.slug,
    name: casino.name,
    summary: casino.summary,
    licenseLabel: casino.licenseLabel,
    licenseUrl: casino.licenseUrl,
    verifiedAt: casino.verifiedAt,
    rating: casino.rating ?? 4.8,
    highlights: casino.highlights.filter((h) => !h.includes(':')),
    logoUrl: logoMap[casino.slug] ?? 'https://www.gambling.com/cdn-cgi/image/h=100,w=150,fit=pad,format=auto/https://objects.kaxmedia.com/auto/o/212506/f71cd5ee2a.png',
    establishedYear,
    bonusDescription,
    termsSummary,
    minDeposit,
    payoutSpeed,
    paymentMethods,
    badges,
    pros,
    cons,
  }
}
