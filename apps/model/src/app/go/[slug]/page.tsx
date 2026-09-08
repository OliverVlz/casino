import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSnapshot } from '@/lib/data'
export default async function DemoExit({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const snapshot = await getSnapshot()
  if (
    !snapshot.casinos.some((c) => c.slug === slug) &&
    !snapshot.offers.some((o) => o.slug === slug)
  )
    notFound()
  return (
    <div className="shell subpage">
      <h1>A concept, not a casino.</h1>
      <p>
        This fictional offer cannot be redeemed. MODEL does not redirect you to
        a gambling operator or accept deposits.
      </p>
      <Link href="/#casino-directory" className="button button-gold">
        Return to the collection
      </Link>
    </div>
  )
}
