import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt', group: 'Contenido' },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 720, height: 480, position: 'centre', formatOptions: { format: 'webp' } },
      { name: 'logo', width: 320, height: 160, position: 'centre', withoutEnlargement: true, formatOptions: { format: 'webp' } },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', localized: true, required: true },
    { name: 'credit', type: 'text' },
  ],
}
