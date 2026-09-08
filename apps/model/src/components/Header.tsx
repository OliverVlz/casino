'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Arrow, Mark } from './Icons'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          className="wordmark"
          href="/"
          aria-label="MODEL home"
          onClick={() => setOpen(false)}
        >
          <Mark />
          MODEL<span className="wordmark-dot">.</span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav
          id="site-navigation"
          className={open ? 'navigation is-open' : 'navigation'}
          aria-label="Main navigation"
        >
          <Link href="/#casino-directory" onClick={() => setOpen(false)}>
            Explore casinos
          </Link>
          <Link
            href="/bonuses"
            aria-current={pathname === '/bonuses' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Bonuses
          </Link>
          <Link href="/#guides" onClick={() => setOpen(false)}>
            The journal
          </Link>
          <Link href="/#methodology" onClick={() => setOpen(false)}>
            Our approach
          </Link>
        </nav>
        <Link href="/#casino-directory" className="header-action">
          Find your fit <Arrow diagonal />
        </Link>
      </div>
    </header>
  )
}
