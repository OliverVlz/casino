import Image from 'next/image'
import Link from 'next/link'
import type { ContentBlock } from '@casino/contracts'
import { Arrow } from './Icons'

type Copy = Extract<ContentBlock, { blockType: 'copy' }>
export function Payments({ content }: { content: Copy }) {
  return (
    <section id="payments" className="payment-section">
      <div className="shell payment-layout">
        <div className="payment-art" aria-hidden="true">
          <Image
            src="/renders/coin/angle.webp"
            alt=""
            width={420}
            height={420}
          />
          <Image
            className="payment-chip"
            src="/renders/chip/CasinoChip_BlackViolet.webp"
            alt=""
            width={210}
            height={210}
          />
        </div>
        <div>
          <h2>{content.heading}</h2>
          {content.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="payment-types">
            <span>Crypto</span>
            <span>Card</span>
            <span>Bank transfer</span>
          </div>
          <a className="text-link" href="#casino-directory">
            Compare payment options <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  )
}
export function Journal({ content }: { content: Copy }) {
  const images = ['card/angle', 'dice/angle', 'roulette/angle']
  return (
    <section id="guides" className="section shell journal">
      <div className="section-heading">
        <h2>{content.heading}</h2>
        <span className="quiet-tag">THE MODEL JOURNAL</span>
      </div>
      <div className="journal-grid">
        {content.body.map((paragraph, index) => {
          const [title, body] = paragraph.split('|')
          return (
            <article key={title} className="journal-story">
              <div className={`journal-art journal-art-${index}`}>
                <Image
                  src={`/renders/${images[index % images.length]}.webp`}
                  width={340}
                  height={340}
                  alt=""
                />
              </div>
              <h3>{title}</h3>
              <p>{body ?? title}</p>
              <a
                className="text-link"
                href={
                  index === 0
                    ? '/bonuses'
                    : index === 1
                      ? '#payments'
                      : '#responsible-play'
                }
              >
                {index === 0
                  ? 'Compare example terms'
                  : index === 1
                    ? 'Explore payment types'
                    : 'Make room for a pause'}
                <Arrow diagonal />
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
export function Methodology({ content }: { content: Copy }) {
  return (
    <section id="methodology" className="section shell methodology">
      <div>
        <h2>{content.heading}</h2>
        <p>Better decisions begin with information you can actually use.</p>
        <Link href="/bonuses" className="text-link">
          Look beyond the headline <Arrow diagonal />
        </Link>
      </div>
      <div>
        {content.body.map((paragraph) => {
          const [heading, body] = paragraph.split('|')
          return (
            <article key={heading}>
              <h3>{heading}</h3>
              <p>{body ?? heading}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
export function Faq({
  content,
}: {
  content: Extract<ContentBlock, { blockType: 'faq' }>
}) {
  return (
    <section className="section shell faq">
      <h2>{content.heading}</h2>
      <div>
        {content.items.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
export function ResponsiblePlay({
  content,
}: {
  content: Extract<ContentBlock, { blockType: 'responsibleGaming' }>
}) {
  return (
    <section id="responsible-play" className="responsible">
      <div className="shell responsible-layout">
        <div className="age-symbol">19+</div>
        <div>
          <h2>{content.heading}</h2>
          <p>{content.body}</p>
          <div className="responsible-links">
            {content.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                rel="noreferrer"
                target="_blank"
              >
                {resource.label}
                <Arrow diagonal />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
