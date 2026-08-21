import { timingSafeEqual } from 'node:crypto'

import config from '@payload-config'
import { getPayload } from 'payload'

import { buildSiteSnapshot } from '@/lib/delivery/buildSiteSnapshot'

type RouteContext = {
  params: Promise<{ siteKey: string }>
}

const bearerToken = (request: Request): string | null => {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null
  return authorization.slice('Bearer '.length)
}

const tokenMatches = (received: string | null, expected: string | undefined): boolean => {
  if (!received || !expected) return false
  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
}

export async function GET(request: Request, { params }: RouteContext): Promise<Response> {
  const { siteKey } = await params
  const url = new URL(request.url)
  const draft = url.searchParams.get('draft') === 'true'
  const expectedToken = draft
    ? process.env.PREVIEW_SECRET ?? 'local-preview-only-change-before-production'
    : process.env.DELIVERY_TOKEN ??
      (process.env.NODE_ENV !== 'production'
        ? 'local-colombia-delivery-only-change-before-production'
        : undefined)

  if (!tokenMatches(bearerToken(request), expectedToken)) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const pageId = url.searchParams.get('pageId') ?? undefined
  const localeParam = url.searchParams.get('locale') ?? undefined
  const locale =
    localeParam === 'es-CO' || localeParam === 'en-CA' || localeParam === 'fr-CA'
      ? localeParam
      : undefined

  if (draft && !pageId) {
    return Response.json({ error: 'pageId es obligatorio para una vista previa.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const snapshot = await buildSiteSnapshot(payload, { draft, locale, pageId, siteKey })
    return Response.json(snapshot, {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo construir el snapshot.'
    const notFound = message.startsWith('No existe') || message.startsWith('No hay páginas')
    return Response.json(
      { error: message },
      {
        status: notFound ? 404 : 500,
        headers: { 'Cache-Control': 'private, no-store, max-age=0' },
      },
    )
  }
}
