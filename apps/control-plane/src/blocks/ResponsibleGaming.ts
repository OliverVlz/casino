import type { Block } from 'payload'

export const ResponsibleGaming: Block = {
  slug: 'responsibleGaming',
  labels: { singular: 'Juego responsable', plural: 'Juego responsable' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'resources',
      type: 'array',
      required: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
