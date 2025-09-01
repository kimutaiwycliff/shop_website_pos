import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
    slug: 'brands',
    admin: {
      useAsTitle: 'name',
      group: 'Shop',
    },
    access: {
      read: authenticated,
      create: authenticated,
      update: authenticated,
      delete: authenticated,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        unique: true,
      },
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  }