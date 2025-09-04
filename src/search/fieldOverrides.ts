import { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: 'Meta',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: 'Categories',
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
      },
      {
        name: 'categoryID',
        type: 'text',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  },
  // Product-specific fields
  {
    name: 'sku',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'barcode',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'price',
    type: 'number',
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'originalPrice',
    type: 'number',
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'brand',
    type: 'group',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
      },
      {
        name: 'slug',
        type: 'text',
      },
    ],
  },
  {
    name: 'status',
    type: 'select',
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived', value: 'archived' },
    ],
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'inStock',
    type: 'number',
    admin: {
      readOnly: true,
    },
  },
  // Search priority for better relevance
  {
    name: 'searchPriority',
    type: 'number',
    defaultValue: 1,
    admin: {
      readOnly: true,
      description: 'Higher values appear first in search results',
    },
  },
]
