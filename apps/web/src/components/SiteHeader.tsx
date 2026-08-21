import Link from 'next/link'

import { Icon } from '@/components/Icon'

const navigation = [
  { href: '/es#casinos', label: 'Casinos' },
  { href: '/es#metodologia', label: 'Cómo evaluamos' },
  { href: '/es#regulacion', label: 'Regulación' },
  { href: '/es#juego-responsable', label: 'Juego responsable' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link aria-label="Juego Claro — inicio" className="wordmark" href="/es">
          <span>Juego</span> <strong>Claro</strong>
        </Link>

        <nav aria-label="Navegación principal" className="desktop-nav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="locale-control" title="Idioma y mercado">
          <Icon name="globe" size={17} />
          <span>ES-CO</span>
          <Icon name="chevron" size={16} />
        </div>

        <details className="mobile-menu">
          <summary aria-label="Abrir navegación">
            <Icon name="menu" size={23} />
            <span>Menú</span>
          </summary>
          <nav aria-label="Navegación móvil">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
