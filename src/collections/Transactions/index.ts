import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  labels: {
    singular: 'Transaction',
    plural: 'Transactions',
  },
  admin: {
    useAsTitle: 'transactionId',
    defaultColumns: ['transactionId', 'type', 'amount', 'method', 'status', 'createdAt'],
    group: 'Shop',
    description: 'All financial transactions including sales, refunds, and adjustments',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'transactionId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated unique transaction ID',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Sale', value: 'sale' },
            { label: 'Refund', value: 'refund' },
            { label: 'Partial Refund', value: 'partial_refund' },
            { label: 'Store Credit', value: 'store_credit' },
            { label: 'Payment', value: 'payment' },
            { label: 'Adjustment', value: 'adjustment' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Refunded', value: 'refunded' },
          ],
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
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '50%',
            step: 0.01,
            description: 'Transaction amount in KES',
          },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'KES',
          options: [
            { label: 'Kenyan Shilling (KES)', value: 'KES' },
            { label: 'US Dollar (USD)', value: 'USD' },
            { label: 'Euro (EUR)', value: 'EUR' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      admin: {
        description: 'Related order (if applicable)',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Customer involved in this transaction',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'M-Pesa', value: 'mpesa' },
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Debit Card', value: 'debit_card' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Store Credit', value: 'store_credit' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this transaction',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-generate transaction ID
        if (operation === 'create' && !data.transactionId) {
          data.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }

        return data
      },
    ],
  },
  defaultSort: '-createdAt',
  timestamps: true,
}
