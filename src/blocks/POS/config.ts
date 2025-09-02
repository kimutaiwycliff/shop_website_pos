import { Block } from 'payload'

export const POSBlock: Block = {
  slug: 'pos',
  labels: {
    singular: 'POS Interface',
    plural: 'POS Interfaces',
  },
  interfaceName: 'POSBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'POS Title',
      defaultValue: 'Point of Sale',
    },
    {
      name: 'storeName',
      type: 'text',
      label: 'Store Name',
      required: true,
      admin: {
        description: 'Name of the store location',
      },
    },
    {
      name: 'cashierRequired',
      type: 'checkbox',
      label: 'Require Cashier Login',
      defaultValue: true,
      admin: {
        description: 'Require staff to login before using POS',
      },
    },
    {
      name: 'enableBarcodeScanning',
      type: 'checkbox',
      label: 'Enable Barcode Scanning',
      defaultValue: true,
      admin: {
        description: 'Allow products to be added by scanning barcodes',
      },
    },
    {
      name: 'enableCustomerDisplay',
      type: 'checkbox',
      label: 'Enable Customer Display',
      defaultValue: true,
      admin: {
        description: 'Show order details to customer on a second screen',
      },
    },
    {
      name: 'enableReceiptPrinting',
      type: 'checkbox',
      label: 'Enable Receipt Printing',
      defaultValue: true,
      admin: {
        description: 'Print receipts automatically after payment',
      },
    },
    {
      name: 'enableCashDrawer',
      type: 'checkbox',
      label: 'Enable Cash Drawer',
      defaultValue: true,
      admin: {
        description: 'Connect to cash drawer hardware',
      },
    },
    {
      name: 'quickSaleCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Categories to show as quick access buttons',
      },
    },
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'POS Payment Methods',
      fields: [
        {
          name: 'method',
          type: 'select',
          required: true,
          dbName: 'payment_method',
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'M-Pesa', value: 'mpesa' },
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'Debit Card', value: 'debit_card' },
            { label: 'Store Credit', value: 'store_credit' },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'requiresHardware',
          type: 'checkbox',
          label: 'Requires Hardware',
          admin: {
            description: 'Method requires card reader or other hardware',
          },
        },
      ],
    },
    {
      name: 'receiptSettings',
      type: 'group',
      label: 'Receipt Settings',
      fields: [
        {
          name: 'headerText',
          type: 'textarea',
          label: 'Receipt Header',
          admin: {
            rows: 3,
          },
        },
        {
          name: 'footerText',
          type: 'textarea',
          label: 'Receipt Footer',
          admin: {
            rows: 3,
          },
        },
        {
          name: 'showLogo',
          type: 'checkbox',
          label: 'Show Logo on Receipt',
          defaultValue: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data) => data.receiptSettings?.showLogo,
          },
        },
      ],
    },
    {
      name: 'taxSettings',
      type: 'group',
      label: 'Tax Settings',
      fields: [
        {
          name: 'defaultTaxRate',
          type: 'number',
          label: 'Default Tax Rate (%)',
          defaultValue: 16,
          min: 0,
          max: 100,
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'taxIncluded',
          type: 'checkbox',
          label: 'Tax Included in Prices',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'discountSettings',
      type: 'group',
      label: 'Discount Settings',
      fields: [
        {
          name: 'enableLineItemDiscounts',
          type: 'checkbox',
          label: 'Enable Line Item Discounts',
          defaultValue: true,
        },
        {
          name: 'enableOrderDiscounts',
          type: 'checkbox',
          label: 'Enable Order-level Discounts',
          defaultValue: true,
        },
        {
          name: 'maxDiscountPercent',
          type: 'number',
          label: 'Maximum Discount Percentage',
          min: 0,
          max: 100,
          defaultValue: 50,
        },
        {
          name: 'requireManagerApproval',
          type: 'checkbox',
          label: 'Require Manager Approval for Large Discounts',
          defaultValue: true,
        },
        {
          name: 'managerApprovalThreshold',
          type: 'number',
          label: 'Manager Approval Threshold (%)',
          min: 0,
          max: 100,
          defaultValue: 20,
          admin: {
            condition: (data) => data.discountSettings?.requireManagerApproval,
          },
        },
      ],
    },
  ],
}
