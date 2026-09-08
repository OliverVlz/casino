'use client'
import dynamic from 'next/dynamic'
import type { ContentBlock } from '@casino/contracts'
import { Arrow } from './Icons'

const LightTunnel = dynamic(() => import('./LightTunnel'), { ssr: false })

export function HeroTunnel({
  content,
}: {
  content: Extract<ContentBlock, { blockType: 'hero' }>
}) {
  return (
    <section className="hero hero--tunnel">
      <div className="hero-tunnel-bg" aria-hidden="true">
        <LightTunnel
          cableColor="#A855F7"
          pulseColor="#A855F7"
          tunnelColor="#5227FF"
          tunnelOpacity={0}
          speed={0.1}
          flowDirection="outward"
          pulseSpeed={2}
          pulseLength={0.28}
          pulseBlend={1}
          pulseWidth={1}
          cableCount={20}
          thickness={0.35}
          rimWidth={0.15}
          waviness={0.3}
          sway={0.5}
          size={1.0}
          centerX={0.0}
          centerY={0.0}
          glow={1.0}
          fadeNear={0.5}
          fadeFar={2}
          brightness={1.0}
          colorVariance={true}
          grain={true}
          grainIntensity={0.05}
          opacity={1.0}
          mouseInteraction={true}
          mouseStrength={0.1}
        />
      </div>

      <div className="shell hero-tunnel-content">
        <div className="hero-tunnel-pill">
          <span className="status-dot" />
          <span>EXPERIMENTAL HERO CONCEPT • LIGHT TUNNEL</span>
        </div>
        <h1 className="hero-tunnel-title">{content.heading}</h1>
        <p className="hero-tunnel-summary">{content.summary}</p>
        
        <div className="hero-actions hero-actions--centered">
          <a className="button button-gold" href={content.primaryActionHref}>
            {content.primaryActionLabel}
            <Arrow />
          </a>
          <a className="text-link" href="#casino-directory">
            A more considered approach
          </a>
        </div>

        <div className="hero-tunnel-footnote">
          <span>Independent thinking. Informed choices.</span>
        </div>
      </div>

      <div className="shell hero-bottom hero-bottom--tunnel">
        <span>Casino discovery, thoughtfully reimagined.</span>
        <a href="#casino-directory">
          Discover your options{' '}
          <span className="down-arrow">
            <Arrow />
          </span>
        </a>
      </div>
    </section>
  )
}
