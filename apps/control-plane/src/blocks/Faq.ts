import type { Block } from 'payload'

export const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'Preguntas y respuestas', plural: 'Preguntas y respuestas' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
        {
          name: 'sources',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'publisher',
              type: 'text',
              admin: { description: 'Obligatorio para incluir esta fuente en una publicación.' },
            },
            { name: 'url', type: 'text', required: true },
            {
              name: 'reviewedAt',
              type: 'date',
              admin: { description: 'Obligatorio para incluir esta fuente en una publicación.' },
            },
          ],
        },
      ],
    },
  ],
}
