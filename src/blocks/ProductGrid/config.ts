import { Block } from 'payload'

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
  },
  interfaceName: 'ProductGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      admin: {
        description: 'Optional title for the product grid section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Optional description text',
      },
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      required: true,
      defaultValue: 'featured',
      dbName: 'display_mode',
      options: [
        {
          label: 'Featured Products',
          value: 'featured',
        },
        {
          label: 'Latest Products',
          value: 'latest',
        },
        {
          label: 'Best Sellers',
          value: 'bestsellers',
        },
        {
          label: 'Sale Products',
          value: 'sale',
        },
        {
          label: 'By Category',
          value: 'category',
        },
        {
          label: 'By Brand',
          value: 'brand',
        },
        {
          label: 'Manual Selection',
          value: 'manual',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, { displayMode } = {}) => displayMode === 'category',
        description: 'Select categories to display products from',
      },
    },
    {
      name: 'brands',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
      admin: {
        condition: (_, { displayMode } = {}) => displayMode === 'brand',
        description: 'Select brands to display products from',
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, { displayMode } = {}) => displayMode === 'manual',
        description: 'Manually select products to display',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'Number of Products',
          min: 1,
          max: 50,
          defaultValue: 12,
          admin: {
            width: '50%',
            condition: (_, { displayMode } = {}) => displayMode !== 'manual',
          },
        },
        {
          name: 'columns',
          type: 'select',
          label: 'Grid Columns',
          defaultValue: 'four',
          options: [
            { label: '2 Columns', value: 'two' },
            { label: '3 Columns', value: 'three' },
            { label: '4 Columns', value: 'four' },
            { label: '5 Columns', value: 'five' },
            { label: '6 Columns', value: 'six' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      label: 'Show Filters',
      defaultValue: true,
      admin: {
        description: 'Display category, brand, and price filters',
      },
    },
    {
      name: 'showSorting',
      type: 'checkbox',
      label: 'Show Sorting Options',
      defaultValue: true,
      admin: {
        description: 'Allow users to sort by price, name, date, etc.',
      },
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      label: 'Show Pagination',
      defaultValue: true,
      admin: {
        description: 'Enable pagination for large product sets',
      },
    },
    {
      name: 'enableQuickView',
      type: 'checkbox',
      label: 'Enable Quick View',
      defaultValue: true,
      admin: {
        description: 'Allow users to preview products without leaving the page',
      },
    },
    {
      name: 'enableWishlist',
      type: 'checkbox',
      label: 'Show Wishlist Button',
      defaultValue: true,
      admin: {
        description: 'Display wishlist/favorite button on product cards',
      },
    },
    {
      name: 'showCompare',
      type: 'checkbox',
      label: 'Show Compare Button',
      defaultValue: false,
      admin: {
        description: 'Allow users to compare products',
      },
    },
    {
      name: 'cardStyle',
      type: 'select',
      label: 'Product Card Style',
      defaultValue: 'standard',
      dbName: 'card_style',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Detailed', value: 'detailed' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'showProductBadges',
      type: 'checkbox',
      label: 'Show Product Badges',
      defaultValue: true,
      admin: {
        description: 'Display "New", "Sale", "Out of Stock" badges',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'transparent',
      dbName: 'bg_color',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'spacing',
      type: 'select',
      label: 'Section Spacing',
      defaultValue: 'normal',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Normal', value: 'normal' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}
