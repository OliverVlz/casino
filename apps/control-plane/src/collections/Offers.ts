import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: { useAsTitle: 'label', group: 'Contenido' },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  versions: { drafts: { autosave: true }, maxPerDoc: 30 },
  fields: [
    { name: 'label', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'casino', type: 'relationship', relationTo: 'casinos', required: true },
    { name: 'destinationUrl', type: 'text', required: true },
    { name: 'termsSummary', type: 'textarea', localized: true, required: true },
    { name: 'validFrom', type: 'date', required: true },
    { name: 'validUntil', type: 'date' },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}
