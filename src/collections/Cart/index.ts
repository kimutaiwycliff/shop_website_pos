import { CollectionConfig } from 'payload'

export const Cart: CollectionConfig = {
  slug: 'cart',
  labels: {
    singular: 'Cart',
    plural: 'Carts',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'itemsCount', 'total', 'status', 'updatedAt'],
    group: 'Shop',
    description: 'Shopping cart sessions',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      if (user) {
        return {
          customer: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: () => true, // Allow anonymous cart creation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: ({ req: { user }, id }) => {
      if (user?.roles?.includes('admin')) return true
      if (user) {
        return {
          customer: {
            equals: user.id,
          },
        }
      }
      // Allow anonymous cart updates by session
      return true
    },
    delete: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return false
    },
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Registered customer (null for guest carts)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      admin: {
        description: 'Session ID for guest carts',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'selectedVariants',
          type: 'group',
          fields: [
            {
              name: 'size',
              type: 'text',
            },
            {
              name: 'color',
              type: 'text',
            },
          ],
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
            description: 'Price per unit at time of adding to cart',
          },
        },
        {
          name: 'lineTotal',
          type: 'number',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'quantity × unitPrice',
          },
        },
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'itemsCount',
          type: 'number',
          label: 'Total Items',
          admin: {
            readOnly: true,
            width: '33%',
          },
        },
        {
          name: 'subtotal',
          type: 'number',
          label: 'Subtotal (KES)',
          admin: {
            readOnly: true,
            width: '33%',
            step: 0.01,
          },
        },
        {
          name: 'total',
          type: 'number',
          label: 'Total (KES)',
          admin: {
            readOnly: true,
            width: '33%',
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Abandoned', value: 'abandoned' },
        { label: 'Converted', value: 'converted' },
        { label: 'Expired', value: 'expired' },
      ],
    },
    {
      name: 'coupon',
      type: 'group',
      label: 'Applied Coupon',
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Coupon Code',
        },
        {
          name: 'discountType',
          type: 'select',
          options: [
            { label: 'Percentage', value: 'percentage' },
            { label: 'Fixed Amount', value: 'fixed' },
          ],
        },
        {
          name: 'discountValue',
          type: 'number',
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'discountAmount',
          type: 'number',
          label: 'Discount Applied (KES)',
          admin: {
            readOnly: true,
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'shippingEstimate',
      type: 'group',
      label: 'Shipping Estimate',
      fields: [
        {
          name: 'method',
          type: 'text',
        },
        {
          name: 'cost',
          type: 'number',
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'estimatedDays',
          type: 'number',
          min: 1,
        },
      ],
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When this cart expires (for cleanup)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Customer notes or special instructions',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate line totals and cart totals
        if (data.items && data.items.length > 0) {
          data.itemsCount = 0
          data.subtotal = 0

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.items.forEach((item: any) => {
            // Calculate line total
            item.lineTotal = item.quantity * item.unitPrice

            // Add to cart totals
            data.itemsCount += item.quantity
            data.subtotal += item.lineTotal
          })

          // Apply coupon discount
          let discountAmount = 0
          if (data.coupon?.code && data.coupon?.discountType && data.coupon?.discountValue) {
            if (data.coupon.discountType === 'percentage') {
              discountAmount = (data.subtotal * data.coupon.discountValue) / 100
            } else if (data.coupon.discountType === 'fixed') {
              discountAmount = Math.min(data.coupon.discountValue, data.subtotal)
            }
            data.coupon.discountAmount = discountAmount
          }

          // Calculate final total
          const shippingCost = data.shippingEstimate?.cost || 0
          data.total = data.subtotal - discountAmount + shippingCost
        } else {
          data.itemsCount = 0
          data.subtotal = 0
          data.total = 0
        }

        // Set expiry date if not set (30 days for registered users, 7 days for guests)
        if (!data.expiresAt) {
          const expiryDays = data.customer ? 30 : 7
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + expiryDays)
          data.expiresAt = expiryDate
        }

        return data
      },
    ],
  },
  timestamps: true,
}
