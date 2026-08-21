import type { CollectionConfig } from 'payload'

import { adminFieldAccess, admins, authenticated } from '@/access'

const criticalFieldAccess = { create: adminFieldAccess, update: adminFieldAccess }

export const JurisdictionPolicies: CollectionConfig = {
  slug: 'jurisdiction-policies',
  admin: { useAsTitle: 'title', group: 'Regulación' },
  access: { create: admins, read: authenticated, update: admins, delete: admins },
  versions: { drafts: false, maxPerDoc: 50 },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'jurisdiction', type: 'text', required: true, access: criticalFieldAccess },
    { name: 'effectiveFrom', type: 'date', required: true, access: criticalFieldAccess },
    { name: 'effectiveUntil', type: 'date', access: criticalFieldAccess },
    { name: 'reviewedAt', type: 'date', required: true, access: criticalFieldAccess },
    {
      name: 'minimumAge',
      type: 'number',
      min: 18,
      required: true,
      access: criticalFieldAccess,
    },
    {
      name: 'promotionalRestrictions',
      type: 'array',
      access: criticalFieldAccess,
      fields: [{ name: 'restriction', type: 'textarea', required: true }],
    },
    {
      name: 'responsibleGamingResources',
      type: 'array',
      required: true,
      access: criticalFieldAccess,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'sources',
      type: 'array',
      required: true,
      minRows: 1,
      access: criticalFieldAccess,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'publisher', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'reviewedAt', type: 'date', required: true },
      ],
    },
    {
      name: 'approval',
      type: 'group',
      access: criticalFieldAccess,
      fields: [
        { name: 'approved', type: 'checkbox', defaultValue: false },
        { name: 'approvedAt', type: 'date' },
        { name: 'approvalNote', type: 'textarea' },
      ],
    },
  ],
  timestamps: true,
}
