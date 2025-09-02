import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Customer',
    plural: 'Customers',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'phone', 'totalOrders', 'totalSpent', 'lastOrderDate'],
    group: 'Shop',
    description: 'Manage customer information and order history',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Personal Information',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'fullName',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Auto-generated from first and last name',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  unique: true,
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
              type: 'row',
              fields: [
                {
                  name: 'dateOfBirth',
                  type: 'date',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'gender',
                  type: 'select',
                  options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                    { label: 'Prefer not to say', value: 'not_specified' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Internal notes about this customer',
                rows: 3,
              },
            },
          ],
        },
        {
          label: 'Addresses',
          fields: [
            {
              name: 'addresses',
              type: 'array',
              label: 'Saved Addresses',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g., Home, Work, etc.',
                  },
                },
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'company',
                  type: 'text',
                },
                {
                  name: 'address1',
                  type: 'text',
                  label: 'Address Line 1',
                  required: true,
                },
                {
                  name: 'address2',
                  type: 'text',
                  label: 'Address Line 2',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'state',
                      type: 'text',
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'zipCode',
                      type: 'text',
                      admin: {
                        width: '33%',
                      },
                    },
                  ],
                },
                {
                  name: 'country',
                  type: 'select',
                  required: true,
                  defaultValue: 'KE',
                  options: [
                    { label: 'Kenya', value: 'KE' },
                    { label: 'Uganda', value: 'UG' },
                    { label: 'Tanzania', value: 'TZ' },
                    { label: 'Rwanda', value: 'RW' },
                    { label: 'Other', value: 'OTHER' },
                  ],
                },
                {
                  name: 'isDefault',
                  type: 'checkbox',
                  label: 'Default Address',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Order History',
          fields: [
            {
              name: 'orders',
              type: 'relationship',
              relationTo: 'orders',
              hasMany: true,
              admin: {
                readOnly: true,
                description: 'All orders placed by this customer',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'totalOrders',
                  type: 'number',
                  label: 'Total Orders',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                    width: '33%',
                  },
                },
                {
                  name: 'totalSpent',
                  type: 'number',
                  label: 'Total Spent (KES)',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                    width: '33%',
                    step: 0.01,
                  },
                },
                {
                  name: 'lastOrderDate',
                  type: 'date',
                  label: 'Last Order',
                  admin: {
                    readOnly: true,
                    width: '33%',
                  },
                },
              ],
            },
            {
              name: 'averageOrderValue',
              type: 'number',
              label: 'Average Order Value (KES)',
              defaultValue: 0,
              admin: {
                readOnly: true,
                step: 0.01,
              },
            },
          ],
        },
        {
          label: 'Preferences',
          fields: [
            {
              name: 'preferences',
              type: 'group',
              fields: [
                {
                  name: 'emailMarketing',
                  type: 'checkbox',
                  label: 'Email Marketing',
                  defaultValue: true,
                  admin: {
                    description: 'Customer consents to receive marketing emails',
                  },
                },
                {
                  name: 'smsMarketing',
                  type: 'checkbox',
                  label: 'SMS Marketing',
                  defaultValue: false,
                  admin: {
                    description: 'Customer consents to receive SMS notifications',
                  },
                },
                {
                  name: 'favoriteCategories',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                  admin: {
                    description: 'Product categories this customer is interested in',
                  },
                },
                {
                  name: 'size',
                  type: 'select',
                  label: 'Preferred Size',
                  options: [
                    { label: 'XS', value: 'XS' },
                    { label: 'S', value: 'S' },
                    { label: 'M', value: 'M' },
                    { label: 'L', value: 'L' },
                    { label: 'XL', value: 'XL' },
                    { label: 'XXL', value: 'XXL' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate full name
        if (data.firstName && data.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`
        }

        // Calculate average order value
        if (data.totalOrders && data.totalSpent) {
          data.averageOrderValue = data.totalSpent / data.totalOrders
        }

        return data
      },
    ],
  },
  timestamps: true,
}