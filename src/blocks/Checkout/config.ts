import { Block } from 'payload'

export const CheckoutBlock: Block = {
  slug: 'checkout',
  labels: {
    singular: 'Checkout',
    plural: 'Checkout',
  },
  interfaceName: 'CheckoutBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Checkout Title',
      defaultValue: 'Checkout',
    },
    {
      name: 'enableGuestCheckout',
      type: 'checkbox',
      label: 'Enable Guest Checkout',
      defaultValue: true,
      admin: {
        description: 'Allow customers to checkout without creating an account',
      },
    },
    {
      name: 'requirePhoneNumber',
      type: 'checkbox',
      label: 'Require Phone Number',
      defaultValue: true,
      admin: {
        description: 'Make phone number a required field',
      },
    },
    {
      name: 'enableAddressAutocomplete',
      type: 'checkbox',
      label: 'Enable Address Autocomplete',
      defaultValue: true,
      admin: {
        description: 'Enable Google Places address autocomplete',
      },
    },
    {
      name: 'defaultCountry',
      type: 'select',
      label: 'Default Country',
      defaultValue: 'KE',
      dbName: 'def_country',
      options: [
        { label: 'Kenya', value: 'KE' },
        { label: 'Uganda', value: 'UG' },
        { label: 'Tanzania', value: 'TZ' },
        { label: 'Rwanda', value: 'RW' },
      ],
    },
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'Available Payment Methods',
      admin: {
        description: 'Configure which payment methods are available',
      },
      fields: [
        {
          name: 'method',
          type: 'select',
          required: true,
          dbName: 'payment_method',
          options: [
            { label: 'M-Pesa', value: 'mpesa' },
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'Debit Card', value: 'debit_card' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'Cash on Delivery', value: 'cod' },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'processingFee',
          type: 'number',
          label: 'Processing Fee (%)',
          min: 0,
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Description shown to customers',
          },
        },
      ],
    },
    {
      name: 'shippingMethods',
      type: 'array',
      label: 'Shipping Methods',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
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
          name: 'estimatedDays',
          type: 'number',
          label: 'Estimated Delivery Days',
          min: 0,
        },
        {
          name: 'freeShippingThreshold',
          type: 'number',
          label: 'Free Shipping Threshold (KES)',
          min: 0,
          admin: {
            step: 100,
          },
        },
      ],
    },
    {
      name: 'termsUrl',
      type: 'text',
      label: 'Terms & Conditions URL',
      defaultValue: '/terms',
    },
    {
      name: 'privacyUrl',
      type: 'text',
      label: 'Privacy Policy URL',
      defaultValue: '/privacy',
    },
    {
      name: 'orderSuccessUrl',
      type: 'text',
      label: 'Order Success URL',
      defaultValue: '/order-confirmation',
    },
    {
      name: 'orderFailureUrl',
      type: 'text',
      label: 'Order Failure URL',
      defaultValue: '/order-failed',
    },
    {
      name: 'enableOrderNotes',
      type: 'checkbox',
      label: 'Enable Order Notes',
      defaultValue: true,
      admin: {
        description: 'Allow customers to add notes to their order',
      },
    },
    {
      name: 'enableNewsletter',
      type: 'checkbox',
      label: 'Enable Newsletter Signup',
      defaultValue: true,
      admin: {
        description: 'Show newsletter signup option during checkout',
      },
    },
    {
      name: 'taxSettings',
      type: 'group',
      label: 'Tax Settings',
      fields: [
        {
          name: 'taxRate',
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
        {
          name: 'taxLabel',
          type: 'text',
          label: 'Tax Label',
          defaultValue: 'VAT',
        },
      ],
    },
  ],
}
