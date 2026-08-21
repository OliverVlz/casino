import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'primaryActionLabel', type: 'text', required: true },
    {
      name: 'primaryActionHref',
      type: 'text',
      required: true,
      admin: { description: 'Ruta interna que comienza con /.' },
      validate: (value: unknown) =>
        typeof value === 'string' && value.startsWith('/')
          ? true
          : 'La ruta debe comenzar con /.',
    },
  ],
}
