import type { Metadata } from 'next'
import Link from 'next/link'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './globals.css'
import { Header } from '@/components/Header'
import { Mark } from '@/components/Icons'
import { getSiteUrl } from '@/lib/data'

// THESIS: a product-studio object introduces a precise editorial comparison.
// OWN-WORLD: obsidian, champagne, ceramic type and one violet inlay; fine rules and generous space.
// STORY: understand the demonstration, choose preferences, compare terms, inspect a fictional record.
// FIRST VIEWPORT: left editorial headline and gold CTA; right 560px token; directory one scroll away.
// FORM: approved MODEL product-studio direction; seed 3ffe7380 acknowledged, user-pinned plan takes precedence.
// FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'MODEL — A better perspective on play',
    template: '%s | MODEL',
  },
  description:
    'A considered casino comparison concept. Explore fictional operators, payment options and example terms.',
  robots: { index: false, follow: false },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="demo-banner">
          An original concept. A fictional collection.{' '}
          <span>No real casinos or offers.</span>
        </div>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="shell">
            <div className="footer-main">
              <Link className="wordmark" href="/">
                <Mark />
                MODEL.
              </Link>
              <p>A better perspective on play.</p>
              <nav aria-label="Footer">
                <Link href="/#methodology">Our approach</Link>
                <Link href="/#responsible-play">Responsible play</Link>
                <Link href="/bonuses">Demo offers</Link>
              </nav>
            </div>
            <div className="footer-bottom">
              <span>© 2026 MODEL Studio · Design demonstration</span>
              <span>Fictional operators. No affiliate commissions. 19+.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
