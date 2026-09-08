import { notFound, redirect } from 'next/navigation'
import { getSnapshot } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params
  const snapshot = await getSnapshot()

  const offer = snapshot.offers?.find(
    (o) => o.slug === slug || o.casinoSlug === slug,
  )

  if (!offer || !offer.destinationUrl) {
    notFound()
  }

  redirect(offer.destinationUrl)
}
