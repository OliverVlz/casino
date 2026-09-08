'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ContentBlock } from '@casino/contracts'
import { Arrow } from './Icons'
const AeroShards = dynamic(() => import('./AeroShards'), { ssr: false })

export function Hero({
  content,
}: {
  content: Extract<ContentBlock, { blockType: 'hero' }>
}) {
  const root = useRef<HTMLElement>(null)
  const art = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = matchMedia('(max-width: 767px)')
    const sync = () => {
      setEnabled(!reduced.matches)
    }
    const timer = window.setTimeout(sync, 700)
    reduced.addEventListener('change', sync)
    return () => {
      clearTimeout(timer)
      reduced.removeEventListener('change', sync)
    }
  }, [])
  useEffect(() => {
    if (!enabled) return
    let disposed = false
    let cleanup: (() => void) | undefined
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return
        gsap.registerPlugin(ScrollTrigger)
        const mm = gsap.matchMedia()
        mm.add(
          '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          () => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8,
              },
            })
            timeline
              .to(
                art.current,
                { yPercent: 15, scale: 1.03, ease: 'none' },
                0,
              )
              .to(
                '.hero-satellite',
                { y: -60, rotation: 12, stagger: 0.05, ease: 'none' },
                0,
              )
          },
          root,
        )
        cleanup = () => mm.revert()
      },
    )
    return () => {
      disposed = true
      cleanup?.()
    }
  }, [enabled])
  return (
    <section
      ref={root}
      className="hero"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !root.current) return
        const rect = root.current.getBoundingClientRect()
        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100
        root.current.style.setProperty('--mouse-x', `${px.toFixed(1)}%`)
        root.current.style.setProperty('--mouse-y', `${py.toFixed(1)}%`)
      }}
      onPointerLeave={() => {
        if (root.current) {
          root.current.style.setProperty('--mouse-x', '76%')
          root.current.style.setProperty('--mouse-y', '46%')
        }
      }}
    >
      <div className="hero-shards-bg" aria-hidden="true">
        <AeroShards
          backgroundColor="#120F17"
          shardColor="#896ABD"
          accentColor="#A855F7"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1}
          depth={1}
          speed={1}
          spin={1}
          interaction="repel"
          density={1.5}
          shardSize={1.1}
          stretch={1}
          turbulence={1}
          glow={1}
          edgeSoftness={2}
          bloom={0.5}
          grain={0.05}
          chromaticAberration={0.0075}
          transitionDuration={1}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather={true}
        />
      </div>
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1>{content.heading}</h1>
          <p>{content.summary}</p>
          <div className="hero-actions">
            <a className="button button-gold" href={content.primaryActionHref}>
              {content.primaryActionLabel}
              <Arrow />
            </a>
            <a className="text-link" href="#methodology">
              A more considered approach
            </a>
          </div>
          <div className="hero-footnote">
            <span className="status-dot" />
            Independent thinking. Informed choices.
          </div>
        </div>
        <div
          ref={art}
          className="hero-art"
          role="region"
          aria-label="Interactive crystal atmosphere"
        >
          <div className="hero-orbit" aria-hidden="true" />
          <Image
            className="hero-satellite satellite-chip"
            src="/renders/chip/angle.webp"
            width={180}
            height={180}
            alt=""
            aria-hidden="true"
            priority
            loading="eager"
          />
          <Image
            className="hero-satellite satellite-coin"
            src="/renders/coin/angle.webp"
            width={120}
            height={120}
            alt=""
            aria-hidden="true"
          />
          <div className="object-caption" aria-hidden="true">
            <span>FLOATING CASINO CARDS</span>
            <span>Click &amp; hold to gather cards</span>
          </div>
        </div>
      </div>
      <div className="shell hero-bottom">
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
