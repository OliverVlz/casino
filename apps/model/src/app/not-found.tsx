import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="shell subpage not-found">
      <h1>A different direction.</h1>
      <p>That page is not part of the MODEL collection.</p>
      <Link href="/#casino-directory" className="button button-gold">
        Explore the collection
      </Link>
    </div>
  )
}
