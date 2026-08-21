import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>Esta página no está en el directorio</h1>
      <span>La ruta puede haber cambiado o todavía no está incluida en el snapshot publicado.</span>
      <Link className={buttonVariants({ className: 'mt-7', variant: 'primary' })} href="/es">
        Volver al inicio
      </Link>
    </main>
  )
}
