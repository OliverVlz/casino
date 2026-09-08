import Link from 'next/link'
import Image from 'next/image'
import { getSnapshot } from '@/lib/data'
import { parseCasino } from '@/lib/catalogue'
import { BonusTable } from '@/components/BonusTable'
export const metadata = { title: 'Compare demo bonuses' }
export default async function Bonuses() {
  const snapshot = await getSnapshot()
  const content = snapshot.pages
    .find((p) => p.route === '/bonuses')
    ?.blocks.find((b) => b.blockType === 'copy')
  const casinos = snapshot.casinos.map((c) => parseCasino(c, snapshot.offers))
  return (
    <div className="shell subpage">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Demo bonuses</span>
      </nav>
      <div className="subpage-intro">
        <div>
          <h1>{content?.heading ?? 'The offer is only the beginning.'}</h1>
          <p>
            {content?.body[0] ??
              'Compare fictional welcome packages and their conditions.'}
          </p>
        </div>
        <Image src="/renders/chip/angle.webp" alt="" width={270} height={270} />
      </div>
      <BonusTable casinos={casinos} />
      <section className="terms-explainer">
        <h2>Read the smaller print.</h2>
        <div>
          <h3>What is the wagering basis?</h3>
          <p>
            A multiplier may apply to the bonus, winnings, or both the deposit
            and bonus. These examples state the basis so you can compare like
            with like.
          </p>
          <h3>What else belongs in the comparison?</h3>
          <p>
            Check expiry, eligible games, maximum bets, withdrawal restrictions
            and identity checks. A headline offer is only one part of the
            decision.
          </p>
          <p>
            MODEL does not accept deposits. All offers on this page are
            fictional and cannot be redeemed.
          </p>
        </div>
      </section>
    </div>
  )
}
