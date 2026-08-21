import Link from 'next/link'

export function SiteFooter({ updatedAt }: { updatedAt: string }) {
  const formatted = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(updatedAt))

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <Link className="wordmark wordmark--footer" href="/es">
            <span>Juego</span> <strong>Claro</strong>
          </Link>
          <p>Directorio editorial multi-mercado. No opera juegos de azar.</p>
        </div>
        <div>
          <strong>Transparencia</strong>
          <Link href="/es#metodologia">Cómo evaluamos</Link>
          <Link href="/es#regulacion">Fuentes y regulación</Link>
        </div>
        <div>
          <strong>Uso responsable</strong>
          <Link href="/es#juego-responsable">Recursos de ayuda</Link>
          <span>Solo para mayores de edad</span>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>Contenido demostrativo; no constituye una recomendación.</span>
        <span>Última revisión editorial: {formatted}</span>
      </div>
    </footer>
  )
}
