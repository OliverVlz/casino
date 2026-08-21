import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { CasinoList } from '@/blocks/CasinoList'
import { CopySection } from '@/blocks/CopySection'
import { Faq } from '@/blocks/Faq'
import { Hero } from '@/blocks/Hero'
import { ResponsibleGaming } from '@/blocks/ResponsibleGaming'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'route', '_status', 'updatedAt'],
  },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'route',
      type: 'text',
      localized: true,
      required: true,
      index: true,
      admin: { description: 'Ruta local sin el locale, por ejemplo / o /guias/licencias.' },
      validate: (value: unknown) =>
        typeof value === 'string' && value.startsWith('/')
          ? true
          : 'La ruta debe comenzar con /.',
    },
    { name: 'description', type: 'textarea', localized: true, required: true },
    {
      name: 'equivalentGroup',
      type: 'text',
      admin: {
        description: 'Solo páginas con el mismo identificador pueden emitir hreflang entre sí.',
      },
    },
    { name: 'reviewedAt', type: 'date', required: true },
    {
      name: 'author',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true,
      required: true,
      minRows: 1,
      blocks: [Hero, CopySection, CasinoList, Faq, ResponsibleGaming],
    },
    {
      name: 'publishingChecks',
      type: 'group',
      fields: [
        { name: 'sourcesReviewed', type: 'checkbox', defaultValue: false },
        { name: 'translationHumanReviewed', type: 'checkbox', defaultValue: false },
        { name: 'regulatoryReviewComplete', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?._status !== 'published') return data
        const checks = data.publishingChecks
        if (
          !checks?.sourcesReviewed ||
          !checks?.translationHumanReviewed ||
          !checks?.regulatoryReviewComplete
        ) {
          throw new Error('No se puede publicar hasta completar las revisiones editorial, humana y regulatoria.')
        }
        return data
      },
    ],
  },
  timestamps: true,
}
