'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ContentBlock } from '@casino/contracts'
import { Arrow } from './Icons'
import type { MotionState } from './HeroScene'

const Scene = dynamic(() => import('./HeroScene'), { ssr: false })
const AeroShards = dynamic(() => import('./AeroShards'), { ssr: false })
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function Hero({
  content,
}: {
  content: Extract<ContentBlock, { blockType: 'hero' }>
}) {
  const root = useRef<HTMLElement>(null)
  const art = useRef<HTMLDivElement>(null)
  const motion = useRef<MotionState>({ progress: 0, x: 0, y: 0 })
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(true)
  const [mobile, setMobile] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = matchMedia('(max-width: 767px)')
    const sync = () => {
      setEnabled(!reduced.matches)
      setMobile(narrow.matches)
    }
    const timer = window.setTimeout(sync, 700)
    reduced.addEventListener('change', sync)
    narrow.addEventListener('change', sync)
    let inView = true
    const visibility = () => setActive(inView && !document.hidden)
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting
      visibility()
    })
    if (root.current) observer.observe(root.current)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      reduced.removeEventListener('change', sync)
      narrow.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])
  useEffect(() => {
    if (!enabled || ready || failed) return
    const timer = setTimeout(onError, 15000)
    return () => clearTimeout(timer)
  }, [enabled, ready, failed, onError])
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
              .to(motion.current, { progress: 1, ease: 'none' }, 0)
              .to(
                art.current,
                { yPercent: 26, xPercent: 12, scale: 1.07, ease: 'none' },
                0,
              )
              .to(
                '.hero-satellite',
                { y: -70, rotation: 15, stagger: 0.05, ease: 'none' },
                0,
              )
            return () => {
              motion.current.progress = 0
            }
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
  const live = enabled && !failed
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
        motion.current.x = Math.max(
          -1,
          Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1),
        )
        motion.current.y = Math.max(
          -1,
          Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1),
        )
      }}
      onPointerLeave={() => {
        motion.current.x = 0
        motion.current.y = 0
        if (root.current) {
          root.current.style.setProperty('--mouse-x', '76%')
          root.current.style.setProperty('--mouse-y', '46%')
        }
      }}
    >
      <div className="hero-background-shards" aria-hidden="true">
        <AeroShards
          backgroundColor="#101112"
          shardColor="#a794d1"
          accentColor="#d3b88c"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1.05}
          spread={0.8}
          depth={1.1}
          speed={0.8}
          spin={0.9}
          interaction="repel"
          density={1.2}
          shardSize={1.0}
          stretch={1.1}
          turbulence={1.0}
          glow={1.2}
          edgeSoftness={2}
          bloom={0.65}
          grain={0.04}
          chromaticAberration={0.005}
          transitionDuration={1.2}
          interactionRadius={1.6}
          interactionStrength={0.6}
          rippleIntensity={1.2}
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
          role="img"
          aria-label="Original obsidian casino token with champagne gold edges and a violet inlay"
        >
          <div className="hero-orbit" aria-hidden="true" />
          <div className="token-frame">
            <Image
              className={
                live && ready ? 'hero-poster is-hidden' : 'hero-poster'
              }
              src="/renders/hero/angle.webp"
              alt=""
              width={1024}
              height={1024}
              sizes="(max-width: 767px) 90vw, 560px"
              priority
            />
            {live && (
              <div className={ready ? 'hero-canvas is-ready' : 'hero-canvas'}>
                <SceneBoundary onError={onError}>
                  <Scene
                    active={active}
                    mobile={mobile}
                    motion={motion}
                    onReady={onReady}
                    onError={onError}
                  />
                </SceneBoundary>
              </div>
            )}
          </div>
          <Image
            className="hero-satellite satellite-chip"
            src="/renders/chip/angle.webp"
            width={180}
            height={180}
            alt=""
            aria-hidden="true"
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
            <span>THE MODEL TOKEN</span>
            <span>Original by design.</span>
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
