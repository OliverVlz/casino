import { NextResponse } from 'next/server'

import { getSnapshot } from '@/lib/snapshot'

type Context = { params: Promise<{ offerSlug: string }> }

export async function GET(_request: Request, { params }: Context) {
  const { offerSlug } = await params
  const snapshot = await getSnapshot()
  const offer = snapshot.offers.find((item) => item.slug === offerSlug)

  if (!offer) return new Response('Enlace no encontrado', { status: 404 })

  const now = Date.now()
  const activeFrom = Date.parse(offer.validFrom) <= now
  const activeUntil = !offer.validUntil || Date.parse(offer.validUntil) >= now
  if (!activeFrom || !activeUntil) return new Response('Enlace no disponible', { status: 410 })

  return NextResponse.redirect(new URL(offer.destinationUrl), 302)
}
