import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: {
    singular: 'Brand',
    plural: 'Brands',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'isActive', 'updatedAt'],
    group: 'Shop',
    description: 'Manage brand information and settings',
    preview: (doc) => {
      return `/brands/${doc?.slug}`
    },
  },
  access: {
    read: () => true, // Allow public read for brands
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand Information',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Brand name as it appears to customers',
              },
            },
            ...slugField(),
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Brief description of the brand',
                rows: 4,
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Brand logo (recommended: square format, min 200x200px)',
              },
            },
            {
              name: 'website',
              type: 'text',
              admin: {
                description: 'Brand website URL',
                placeholder: 'https://example.com',
              },
              validate: (val: string | null | undefined) => {
                if (!val) return true
                try {
                  new URL(val)
                  return true
                } catch {
                  return 'Please enter a valid URL'
                }
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Active Brand',
              defaultValue: true,
              admin: {
                description: 'Only active brands will be displayed on the website',
              },
            },
          ],
        },
        {
          label: 'Contact Information',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      admin: {
                        width: '50%',
                        placeholder: '+254 700 000 000',
                      },
                    },
                  ],
                },
                {
                  name: 'address',
                  type: 'group',
                  label: 'Address',
                  fields: [
                    {
                      name: 'street',
                      type: 'text',
                      label: 'Street Address',
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'city',
                          type: 'text',
                          admin: {
                            width: '50%',
                          },
                        },
                        {
                          name: 'country',
                          type: 'text',
                          defaultValue: 'Kenya',
                          admin: {
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Search Engine Optimization',
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  defaultSort: 'name',
  timestamps: true,
}
