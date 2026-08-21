import type { CollectionConfig } from 'payload'

import { admins, authenticated } from '@/access'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'eventId',
    group: 'Publicación',
    defaultColumns: ['site', 'snapshotVersion', 'state', 'createdAt'],
  },
  access: { create: admins, read: authenticated, update: admins, delete: admins },
  fields: [
    { name: 'eventId', type: 'text', required: true, unique: true, index: true },
    { name: 'snapshotVersion', type: 'number', required: true, index: true },
    { name: 'checksum', type: 'text', required: true },
    { name: 'tags', type: 'json', required: true },
    {
      name: 'state',
      type: 'select',
      defaultValue: 'queued',
      required: true,
      options: ['queued', 'delivering', 'applied', 'failed'],
    },
    { name: 'attemptCount', type: 'number', defaultValue: 0 },
    { name: 'lastAttemptAt', type: 'date' },
    { name: 'appliedAt', type: 'date' },
    { name: 'lastError', type: 'textarea' },
  ],
  timestamps: true,
}
