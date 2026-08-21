import type { ContentBlock, SiteSnapshot, SnapshotPage } from '@casino/contracts'
import Link from 'next/link'

import { CasinoDirectory } from '@/components/CasinoDirectory'
import { Icon } from '@/components/Icon'

const SourceLinks = ({ sources }: { sources: Extract<ContentBlock, { blockType: 'copy' }>['sources'] }) => {
  if (sources.length === 0) return null

  return (
    <div className="source-list">
      <strong>Fuentes revisadas</strong>
      {sources.map((source) => (
        <a href={source.url} key={source.url} rel="noopener noreferrer" target="_blank">
          {source.publisher}: {source.label} <Icon name="external" size={15} />
        </a>
      ))}
    </div>
  )
}

const Methodology = ({ block }: { block: Extract<ContentBlock, { blockType: 'copy' }> }) => (
  <section aria-labelledby="methodology-heading" className="methodology" id="metodologia">
    <h2 id="methodology-heading">{block.heading}</h2>
    <ol className="method-steps">
      {block.body.map((paragraph, index) => (
        <li key={paragraph}>
          <span>{index + 1}</span>
          <p>{paragraph}</p>
        </li>
      ))}
    </ol>
    <SourceLinks sources={block.sources} />
  </section>
)

const ResponsibleGaming = ({
  block,
}: {
  block: Extract<ContentBlock, { blockType: 'responsibleGaming' }>
}) => (
  <aside aria-labelledby="responsible-heading" className="responsible-panel" id="regulacion">
    <h2 id="responsible-heading">{block.heading}</h2>
    <p>{block.body}</p>
    <div className="responsible-links" id="juego-responsable">
      {block.resources.map((resource) => (
        <a href={resource.url} key={resource.url} rel="noopener noreferrer" target="_blank">
          {resource.label} <Icon name="external" size={15} />
        </a>
      ))}
    </div>
  </aside>
)

const Faq = ({ block }: { block: Extract<ContentBlock, { blockType: 'faq' }> }) => (
  <section aria-labelledby="faq-heading" className="faq-section">
    <h2 id="faq-heading">{block.heading}</h2>
    <div className="faq-list">
      {block.items.map((item, index) => (
        <details key={item.question} open={index === 0}>
          <summary>
            <span>{item.question}</span>
            <Icon name="chevron" />
          </summary>
          <div className="faq-answer">
            <p>{item.answer}</p>
            {item.sources.map((source) => (
              <a href={source.url} key={source.url} rel="noopener noreferrer" target="_blank">
                Fuente: {source.publisher} <Icon name="external" size={14} />
              </a>
            ))}
          </div>
        </details>
      ))}
    </div>
  </section>
)

export function PageRenderer({ page, snapshot }: { page: SnapshotPage; snapshot: SiteSnapshot }) {
  const hero = page.blocks.find(
    (block): block is Extract<ContentBlock, { blockType: 'hero' }> => block.blockType === 'hero',
  )
  const casinoList = page.blocks.find(
    (block): block is Extract<ContentBlock, { blockType: 'casinoList' }> =>
      block.blockType === 'casinoList',
  )
  const copyBlocks = page.blocks.filter(
    (block): block is Extract<ContentBlock, { blockType: 'copy' }> => block.blockType === 'copy',
  )
  const responsible = page.blocks.find(
    (block): block is Extract<ContentBlock, { blockType: 'responsibleGaming' }> =>
      block.blockType === 'responsibleGaming',
  )
  const faq = page.blocks.find(
    (block): block is Extract<ContentBlock, { blockType: 'faq' }> => block.blockType === 'faq',
  )
  const visibleCasinos = casinoList
    ? casinoList.casinoSlugs
        .map((slug) => snapshot.casinos.find((casino) => casino.slug === slug))
        .filter((casino): casino is SiteSnapshot['casinos'][number] => Boolean(casino))
    : []

  return (
    <main>
      <section className="intro-band">
        <div className="intro-band__inner">
          <h1>{hero?.heading ?? page.title}</h1>
          {hero?.summary ? <p className="intro-summary">{hero.summary}</p> : null}
          <p className="intro-disclosure">
            <Icon name="info" size={19} /> Sitio de demostración · Sin operadores reales
          </p>
        </div>
      </section>

      <div className="content-shell">
        {casinoList ? (
          <CasinoDirectory
            casinos={visibleCasinos}
            heading={casinoList.heading}
            intro={casinoList.intro}
            localePath="/es"
            offers={snapshot.offers}
          />
        ) : null}

        <div className="editorial-grid">
          {copyBlocks.map((block) => (
            <Methodology block={block} key={block.heading} />
          ))}
          {responsible ? <ResponsibleGaming block={responsible} /> : null}
        </div>

        {faq ? <Faq block={faq} /> : null}

        <section className="editorial-note" aria-label="Nota editorial">
          <strong>Antes de salir del directorio</strong>
          <p>
            Comprueba el dominio y la información contractual en la fuente institucional. Una posición
            en este listado no sustituye esa verificación.
          </p>
          <Link href="#casinos">Volver al listado <Icon name="arrow" size={17} /></Link>
        </section>
      </div>
    </main>
  )
}
