import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'from', group: 'Publicación' },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'to', type: 'text', required: true },
    {
      name: 'statusCode',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 Permanente', value: '301' },
        { label: '302 Temporal', value: '302' },
      ],
    },
  ],
  timestamps: true,
}
