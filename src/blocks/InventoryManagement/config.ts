import { Block } from 'payload'

export const InventoryManagementBlock: Block = {
  slug: 'inventoryManagement',
  labels: {
    singular: 'Inventory Management',
    plural: 'Inventory Management',
  },
  interfaceName: 'InventoryManagementBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Management Title',
      defaultValue: 'Inventory Management',
    },
    {
      name: 'enableBulkActions',
      type: 'checkbox',
      label: 'Enable Bulk Actions',
      defaultValue: true,
      admin: {
        description: 'Allow bulk stock updates and transfers',
      },
    },
    {
      name: 'enableStockAlerts',
      type: 'checkbox',
      label: 'Enable Stock Alerts',
      defaultValue: true,
      admin: {
        description: 'Show low stock and out of stock alerts',
      },
    },
  ],
}
