import React from 'react'
import { getSnapshot, getCasinos } from '@/lib/data'
import { HomeClient } from './HomeClient'

export const dynamic = 'force-static'

export default async function HomePage() {
  const snapshot = await getSnapshot()
  const casinos = getCasinos(snapshot)

  return <HomeClient initialCasinos={casinos} />
}
