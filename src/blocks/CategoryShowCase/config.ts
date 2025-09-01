import type { Block } from 'payload'

export const CategoryShowcase: Block = {
    slug: 'categoryShowcase',
    interfaceName: 'CategoryShowcaseBlock',
    labels: {
      singular: 'Category Showcase',
      plural: 'Category Showcases',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Section Title',
        required: true,
      },
      {
        name: 'subtitle',
        type: 'textarea',
        label: 'Subtitle/Description',
      },
      {
        name: 'categories',
        type: 'array',
        label: 'Categories',
        minRows: 2,
        maxRows: 12,
        fields: [
          {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            required: true,
          },
          {
            name: 'customImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Custom Category Image',
          },
          {
            name: 'customTitle',
            type: 'text',
            label: 'Custom Title (Override category name)',
          },
          {
            name: 'featured',
            type: 'checkbox',
            label: 'Featured Category',
            defaultValue: false,
          },
        ],
      },
    ],
  };
