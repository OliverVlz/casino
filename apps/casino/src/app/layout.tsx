import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/inter/900.css'
import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Online Casino Canada 2026 – Top 10 Ranked | BestCasinoRanker',
  description:
    'Compare Canada’s top 10 online casinos for 2026. Interac deposits, CAD bonuses, and iGaming Ontario licensed operators. Updated monthly by Canadian casino experts.',
  keywords: [
    'best online casino canada',
    'best online casino ontario',
    'interac casino canada',
    'igaming ontario casinos',
    'casino bonus canada',
    'online casino canada 2026',
  ],
  metadataBase: new URL('https://bestcasinoranker.com'),
  alternates: {
    canonical: 'https://bestcasinoranker.com/',
  },
  openGraph: {
    title: 'Best Online Casino Canada 2026 – Top 10 Ranked',
    description:
      'Compare Canada’s top 10 online casinos. Interac deposits, CAD bonuses, iGaming Ontario licensed.',
    siteName: 'BestCasinoRanker',
    locale: 'en_CA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-CA">
      <body className="antialiased">{children}</body>
    </html>
  )
}
