import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageRenderer } from '@/components/PageRenderer'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getPreviewSnapshot } from '@/lib/snapshot'

type Props = {
  params: Promise<{ pageId: string }>
  searchParams: Promise<{ locale?: string; secret?: string }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Vista previa editorial',
  robots: { index: false, follow: false, nocache: true },
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const [{ pageId }, query] = await Promise.all([params, searchParams])
  const expectedSecret = process.env.PREVIEW_SECRET
  if (!expectedSecret || query.secret !== expectedSecret) notFound()

  const locale =
    query.locale === 'en-CA' || query.locale === 'fr-CA' ? query.locale : 'es-CO'

  const previewResult = await getPreviewSnapshot(pageId, locale)
    .then((snapshot) => ({ snapshot, error: null }))
    .catch((error: unknown) => ({ snapshot: null, error }))

  if (!previewResult.snapshot) {
    return (
      <main className="preview-error">
        <RefreshRouteOnSave />
        <h1>No pudimos cargar el borrador</h1>
        <p>
          Comprueba que Payload y PostgreSQL estén activos. Cuando vuelvas a guardar la página,
          esta vista intentará conectarse de nuevo.
        </p>
        <code>
          {previewResult.error instanceof Error
            ? previewResult.error.message
            : 'Error desconocido del CMS'}
        </code>
      </main>
    )
  }

  const page = previewResult.snapshot.pages.find((item) => item.id === pageId)
  if (!page) notFound()

  return (
    <>
      <RefreshRouteOnSave />
      <div className="preview-status" role="status">
        Vista previa editorial · Los cambios se actualizan al guardarse automáticamente
      </div>
      <SiteHeader />
      <PageRenderer page={page} snapshot={previewResult.snapshot} />
      <SiteFooter updatedAt={page.reviewedAt} />
    </>
  )
}
