import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Casinos: CollectionConfig = {
  slug: 'casinos',
  admin: { useAsTitle: 'name', group: 'Contenido' },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  versions: { drafts: { autosave: true }, maxPerDoc: 30 },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'summary', type: 'textarea', localized: true, required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'licenseLabel', type: 'text', required: true },
    { name: 'licenseUrl', type: 'text', required: true },
    { name: 'verifiedAt', type: 'date', required: true },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    {
      name: 'highlights',
      type: 'array',
      localized: true,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
  timestamps: true,
}
