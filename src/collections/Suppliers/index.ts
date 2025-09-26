import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  labels: {
    singular: 'Supplier',
    plural: 'Suppliers',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contactPerson', 'email', 'phone', 'leadTime'],
    group: 'Shop',
    description: 'Manage product suppliers and vendor information',
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
      label: 'Supplier Name',
      admin: {
        description: 'The official name of the supplier company',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Brief description of the supplier and what they provide',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Information',
          fields: [
            {
              name: 'contactPerson',
              type: 'text',
              label: 'Primary Contact',
              admin: {
                description: 'Name of the main contact person at this supplier',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'website',
              type: 'text',
              label: 'Website',
              admin: {
                description: 'Supplier website URL',
              },
            },
          ],
        },
        {
          label: 'Address',
          fields: [
            {
              name: 'address',
              type: 'group',
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
                      label: 'City',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'state',
                      type: 'text',
                      label: 'State/Province',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'zipCode',
                      type: 'text',
                      label: 'ZIP/Postal Code',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      label: 'Country',
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
        {
          label: 'Supply Terms',
          fields: [
            {
              name: 'leadTime',
              type: 'number',
              label: 'Lead Time (days)',
              min: 0,
              defaultValue: 7,
              admin: {
                description: 'Average number of days from order to delivery',
              },
            },
            {
              name: 'paymentTerms',
              type: 'text',
              label: 'Payment Terms',
              admin: {
                description: 'e.g., Net 30, 50% upfront, etc.',
              },
            },
            {
              name: 'currency',
              type: 'select',
              label: 'Currency',
              defaultValue: 'KES',
              options: [
                { label: 'Kenyan Shilling (KES)', value: 'KES' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'Euro (EUR)', value: 'EUR' },
              ],
            },
            {
              name: 'minimumOrderValue',
              type: 'number',
              label: 'Minimum Order Value (KES)',
              min: 0,
              admin: {
                description: 'Minimum purchase amount required',
              },
            },
            {
              name: 'active',
              type: 'checkbox',
              label: 'Active Supplier',
              defaultValue: true,
              admin: {
                description: 'Only active suppliers will be available for product assignment',
              },
            },
          ],
        },
        {
          label: 'Categories',
          fields: [
            {
              name: 'productCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description: 'Product categories this supplier provides',
              },
            },
            {
              name: 'brands',
              type: 'relationship',
              relationTo: 'brands',
              hasMany: true,
              admin: {
                description: 'Brands this supplier provides',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Additional notes for internal reference',
      },
    },
  ],
  timestamps: true,
}
