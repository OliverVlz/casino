import Link from 'next/link'
import { getSnapshot } from '@/lib/data'
import { parseCasino } from '@/lib/catalogue'
import { HeroTunnel } from '@/components/HeroTunnel'
import { Catalogue } from '@/components/Catalogue'
import {
  Payments,
  Journal,
  Methodology,
  Faq,
  ResponsiblePlay,
} from '@/components/Editorial'
import { BonusTable } from '@/components/BonusTable'
import { Arrow } from '@/components/Icons'

export default async function TunnelPage() {
  const snapshot = await getSnapshot()
  const page = snapshot.pages.find((p) => p.route === '/')!
  const hero = page.blocks.find((b) => b.blockType === 'hero')
  const directory = page.blocks.find((b) => b.blockType === 'casinoList')
  const copies = page.blocks.filter((b) => b.blockType === 'copy')
  const faq = page.blocks.find((b) => b.blockType === 'faq')
  const responsible = page.blocks.find(
    (b) => b.blockType === 'responsibleGaming',
  )
  const casinos = snapshot.casinos.map((c) => parseCasino(c, snapshot.offers))

  return (
    <>
      {hero && <HeroTunnel content={hero} />}
      <Catalogue
        casinos={casinos}
        heading={directory?.heading ?? 'Explore the collection.'}
        intro={directory?.intro ?? 'Compare fictional casino concepts.'}
      />
      {copies[0] && <Payments content={copies[0]} />}
      <section className="section shell bonus-section">
        <div className="section-heading">
          <div>
            <h2>More than a welcome bonus.</h2>
            <p>
              The numbers catch your eye. The conditions deserve your attention.
            </p>
          </div>
          <Link className="text-link" href="/bonuses">
            Compare all offers <Arrow diagonal />
          </Link>
        </div>
        <BonusTable casinos={casinos} compact />
      </section>
      {copies[1] && <Journal content={copies[1]} />}
      {copies[2] && <Methodology content={copies[2]} />}
      {faq && <Faq content={faq} />}
      {responsible && <ResponsiblePlay content={responsible} />}
    </>
  )
}
