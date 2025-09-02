import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  labels: {
    singular: 'Inventory Item',
    plural: 'Inventory',
  },
  admin: {
    useAsTitle: 'productName',
    defaultColumns: [
      'productName',
      'sku',
      'currentStock',
      'minStockLevel',
      'status',
      'lastUpdated',
    ],
    group: 'Shop',
    description: 'Track inventory levels and stock movements',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      unique: true,
      admin: {
        description: 'The product this inventory record tracks',
      },
    },
    {
      name: 'productName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-populated from product',
      },
    },
    {
      name: 'sku',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-populated from product',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'currentStock',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          admin: {
            width: '25%',
            step: 1,
          },
        },
        {
          name: 'minStockLevel',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 5,
          admin: {
            width: '25%',
            step: 1,
            description: 'Low stock alert threshold',
          },
        },
        {
          name: 'maxStockLevel',
          type: 'number',
          min: 0,
          admin: {
            width: '25%',
            step: 1,
            description: 'Maximum recommended stock level',
          },
        },
        {
          name: 'reorderPoint',
          type: 'number',
          min: 0,
          admin: {
            width: '25%',
            step: 1,
            description: 'Automatic reorder trigger point',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'in_stock',
      options: [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Low Stock', value: 'low_stock' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'Discontinued', value: 'discontinued' },
      ],
      admin: {
        description: 'Current stock status',
      },
    },
    {
      name: 'location',
      type: 'group',
      label: 'Storage Location',
      fields: [
        {
          name: 'warehouse',
          type: 'text',
          defaultValue: 'Main Store',
        },
        {
          name: 'aisle',
          type: 'text',
        },
        {
          name: 'shelf',
          type: 'text',
        },
        {
          name: 'bin',
          type: 'text',
        },
      ],
    },
    {
      name: 'stockMovements',
      type: 'array',
      label: 'Stock Movement History',
      admin: {
        readOnly: true,
        description: 'Automatic log of all stock changes',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Sale', value: 'sale' },
            { label: 'Restock', value: 'restock' },
            { label: 'Return', value: 'return' },
            { label: 'Damage', value: 'damage' },
            { label: 'Loss', value: 'loss' },
            { label: 'Adjustment', value: 'adjustment' },
          ],
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'previousStock',
          type: 'number',
          required: true,
        },
        {
          name: 'newStock',
          type: 'number',
          required: true,
        },
        {
          name: 'reason',
          type: 'text',
          required: true,
        },
        {
          name: 'reference',
          type: 'text',
          admin: {
            description: 'Order number, supplier reference, etc.',
          },
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'User who made this change',
          },
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'supplier',
      type: 'group',
      label: 'Supplier Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Supplier Name',
        },
        {
          name: 'contact',
          type: 'text',
          label: 'Contact Person',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'leadTime',
          type: 'number',
          label: 'Lead Time (days)',
          min: 0,
          admin: {
            description: 'Time it takes to receive new stock',
          },
        },
      ],
    },
    {
      name: 'costInfo',
      type: 'group',
      label: 'Cost Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'lastPurchasePrice',
              type: 'number',
              label: 'Last Purchase Price (KES)',
              min: 0,
              admin: {
                width: '50%',
                step: 0.01,
              },
            },
            {
              name: 'averageCost',
              type: 'number',
              label: 'Average Cost (KES)',
              min: 0,
              admin: {
                width: '50%',
                step: 0.01,
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'lastPurchaseDate',
          type: 'date',
          label: 'Last Purchase Date',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this inventory item',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-populate product info
        if (data.product && operation === 'create') {
          const product = await req.payload.findByID({
            collection: 'products',
            id: data.product,
            depth: 0,
          })

          if (product) {
            data.productName = product.title
            data.sku = product.sku
          }
        }

        // Auto-update status based on stock levels
        if (typeof data.currentStock === 'number' && typeof data.minStockLevel === 'number') {
          if (data.currentStock === 0) {
            data.status = 'out_of_stock'
          } else if (data.currentStock <= data.minStockLevel) {
            data.status = 'low_stock'
          } else {
            data.status = 'in_stock'
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
