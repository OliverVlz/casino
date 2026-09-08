import { redirect } from 'next/navigation'
import { getSnapshot, getCasino } from '@/lib/data'

interface GoRouteProps {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: Request, { params }: GoRouteProps) {
  const { slug } = await params
  const snapshot = await getSnapshot()
  const casino = getCasino(snapshot, slug)

  if (!casino) {
    redirect('/')
  }

  // In production or demo, redirect to operator landing page or review
  redirect(`https://www.google.com/search?q=${encodeURIComponent(casino.name + ' official casino site')}`)
}
