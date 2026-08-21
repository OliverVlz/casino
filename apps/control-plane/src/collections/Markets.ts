import type { CollectionConfig } from 'payload'

import { admins, authenticated } from '@/access'

export const Markets: CollectionConfig = {
  slug: 'markets',
  admin: { useAsTitle: 'name', group: 'Configuración' },
  access: { create: admins, read: authenticated, update: admins, delete: admins },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'countryCode', type: 'text', required: true },
    { name: 'jurisdiction', type: 'text', required: true },
  ],
}
