import type { CollectionConfig } from 'payload'

import { admins, authenticated } from '@/access'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: { useAsTitle: 'name', group: 'Configuración' },
  access: { create: admins, read: authenticated, update: admins, delete: admins },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'key', type: 'text', required: true, unique: true, index: true },
    { name: 'domain', type: 'text', required: true, unique: true },
    { name: 'market', type: 'relationship', relationTo: 'markets', required: true },
    { name: 'defaultLocale', type: 'relationship', relationTo: 'locales', required: true },
    {
      name: 'supportedLocales',
      type: 'relationship',
      relationTo: 'locales',
      hasMany: true,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'development',
      options: ['development', 'staging', 'production'],
      required: true,
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'brandName', type: 'text', required: true },
        { name: 'accentColor', type: 'text', defaultValue: '#ddff46' },
      ],
    },
    {
      name: 'syncStatus',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'appliedVersion', type: 'number', defaultValue: 0 },
        { name: 'lastContactAt', type: 'date' },
        { name: 'state', type: 'select', options: ['never', 'healthy', 'delayed', 'failed'] },
      ],
    },
  ],
  timestamps: true,
}
