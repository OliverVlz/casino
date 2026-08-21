import type { CollectionConfig } from 'payload'

import { admins, adminsOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8,
    verify: true,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: { useAsTitle: 'email', group: 'Administración' },
  access: {
    create: admins,
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'totpRequired',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bandera de política. La integración TOTP se completa antes de producción.',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        const existingUsers = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
          req,
        })

        return existingUsers.totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
  },
  timestamps: true,
}
