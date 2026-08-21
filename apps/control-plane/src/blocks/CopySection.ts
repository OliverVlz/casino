import type { Block } from 'payload'

export const CopySection: Block = {
  slug: 'copy',
  labels: { singular: 'Sección editorial', plural: 'Secciones editoriales' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'sources',
      type: 'array',
      admin: { description: 'Usa fuentes primarias y registra cuándo fueron revisadas.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'publisher', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'reviewedAt', type: 'date', required: true },
      ],
    },
  ],
}
