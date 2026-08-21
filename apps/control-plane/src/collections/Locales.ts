import type { CollectionConfig } from 'payload'

import { admins, authenticated } from '@/access'

export const Locales: CollectionConfig = {
  slug: 'locales',
  admin: { useAsTitle: 'label', group: 'Configuración' },
  access: { create: admins, read: authenticated, update: admins, delete: admins },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'languageCode', type: 'text', required: true },
  ],
}
