import type { Block } from 'payload'

export const CasinoList: Block = {
  slug: 'casinoList',
  labels: { singular: 'Listado de casinos', plural: 'Listados de casinos' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'intro', type: 'textarea', required: true },
    {
      name: 'casinos',
      type: 'relationship',
      relationTo: 'casinos',
      hasMany: true,
      required: true,
    },
  ],
}
