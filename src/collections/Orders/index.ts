import admin from '@/access/admin'
import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
    group: 'Shop',
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
    create: ({ req: { user } }) => Boolean(user),
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: ['users', 'customers'], // Allow both users and customers
      required: false, // Make this optional to accommodate POS sales
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
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
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
          },
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
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        {
          name: 'method',
          type: 'text',
          required: true,
        },
        {
          name: 'cost',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'address',
          type: 'group',
          fields: [
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
              name: 'address',
              type: 'text',
              required: true,
            },
            {
              name: 'apartment',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'state',
              type: 'text',
              required: true,
            },
            {
              name: 'zipCode',
              type: 'text',
              required: true,
            },
            {
              name: 'country',
              type: 'text',
              required: true,
              defaultValue: 'US',
            },
          ],
        },
      ],
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        {
          name: 'method',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Credit Card',
              value: 'card',
            },
            {
              label: 'PayPal',
              value: 'paypal',
            },
            {
              label: 'Apple Pay',
              value: 'apple_pay',
            },
            {
              label: 'Google Pay',
              value: 'google_pay',
            },
            {
              label: 'M-Pesa',
              value: 'mpesa',
            },
            {
              label: 'Cash',
              value: 'cash',
            },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            {
              label: 'Pending',
              value: 'pending',
            },
            {
              label: 'Paid',
              value: 'paid',
            },
            {
              label: 'Failed',
              value: 'failed',
            },
            {
              label: 'Refunded',
              value: 'refunded',
            },
            {
              label: 'Partially Paid',
              value: 'partial',
            },
          ],
        },
        {
          name: 'transactionId',
          type: 'text',
        },
        {
          name: 'amountPaid',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'remainingBalance',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            step: 0.01,
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'paymentInstallments',
      type: 'array',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'method',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Cash',
              value: 'cash',
            },
            {
              label: 'M-Pesa',
              value: 'mpesa',
            },
            {
              label: 'Credit Card',
              value: 'card',
            },
          ],
        },
        {
          name: 'transactionId',
          type: 'text',
        },
        {
          name: 'paidAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date(),
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tracking',
      type: 'group',
      fields: [
        {
          name: 'carrier',
          type: 'text',
        },
        {
          name: 'trackingNumber',
          type: 'text',
        },
        {
          name: 'trackingUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }

        // Calculate totals
        if (data.items && data.items.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.subtotal = data.items.reduce((sum: number, item: any) => {
            return sum + item.price * item.quantity
          }, 0)

          const shippingCost = data.shipping?.cost || 0
          const tax = data.tax || 0
          data.total = data.subtotal + shippingCost + tax
        }

        if (data.paymentInstallments && data.paymentInstallments.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.payment.amountPaid = data.paymentInstallments.reduce(
            (sum: number, installment: any) => {
              return sum + installment.amount
            },
            0,
          )

          data.payment.remainingBalance = data.total - data.payment.amountPaid

          // Update payment status based on amount paid
          if (data.payment.amountPaid >= data.total) {
            data.payment.status = 'paid'
          } else if (data.payment.amountPaid > 0) {
            data.payment.status = 'partial'
          }
        }

        return data
      },
    ],
  },
}
