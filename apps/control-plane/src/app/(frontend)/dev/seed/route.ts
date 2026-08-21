import config from '@payload-config'
import { getPayload } from 'payload'

import { seedColombia } from '@/seed'

export async function POST(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'No disponible.' }, { status: 404 })
  }

  const token = request.headers.get('authorization')
  const expected = `Bearer ${process.env.SEED_SECRET ?? 'local-seed-only-change-before-production'}`
  if (token !== expected) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    await seedColombia(payload)
    return Response.json({ ok: true, siteKey: 'colombia-demo' })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'No se pudo importar Colombia.' },
      { status: 500 },
    )
  }
}
