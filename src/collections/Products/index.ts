
import {
  //   BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'category', 'inStock', 'featured'],
    group: 'Shop',
    description: 'Manage all products in your store',
    pagination: {
      defaultLimit: 20,
      limits: [10, 20, 50],
    },
  },
  fields: [
    // Basic Product Information
    {
      name: 'title',
      type: 'text',
      label: 'Product Title',
      required: true,
      unique: true,
      admin: {
        description: 'The name of your product as it will appear to customers',
      },
    },
    ...slugField(),
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the product',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            // BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
    // Pricing
    {
      name: 'price',
      type: 'number',
      label: 'Current Price (KES)',
      required: true,
      min: 0,
      admin: {
        step: 50,
        description: 'Current selling price in Kenyan Shillings',
      },
    },
    {
      name: 'originalPrice',
      type: 'number',
      label: 'Original Price (KES)',
      min: 0,
      admin: {
        step: 50,
        description: 'Original price before discount. Leave empty if no discount.',
        condition: (data) => data.price > 0,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate: (val: number | null | undefined, { data }: { data: any }) => {
        if (val && data.price && val <= data.price) {
          return 'Original price must be higher than current price'
        }
        return true
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
      admin: {
        position: 'sidebar',
      },
    },
    // Product Images
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      required: true,
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Upload multiple product images. First image will be the main image.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Product image',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          admin: {
            description: 'Alternative text for accessibility and SEO',
          },
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          label: 'Primary Image',
          defaultValue: false,
          admin: {
            description: 'Mark as the main product image',
          },
        },
      ],
    },
    // Product Variants
    {
      name: 'colors',
      type: 'array',
      label: 'Available Colors',
      admin: {
        description: 'Colors available for this product',
      },
      fields: [
        {
          name: 'colorName',
          type: 'text',
          label: 'Color Name',
          required: true,
        },
        {
          name: 'colorCode',
          type: 'text',
          label: 'Color Code (Hex)',
          admin: {
            description: 'Hex color code (e.g., #FF0000 for red)',
          },
          validate: (val: string | null | undefined) => {
            if (val && !/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Please enter a valid hex color code (e.g., #FF0000)'
            }
            return true
          },
        },
        {
          name: 'colorImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Color Specific Image',
          admin: {
            description: 'Optional: Upload an image showing this color variant',
          },
        },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'Available Sizes',
      admin: {
        description: 'Sizes available for this product',
      },
      fields: [
        {
          name: 'sizeName',
          type: 'text',
          label: 'Size',
          required: true,
        },
        {
          name: 'sizeCode',
          type: 'select',
          label: 'Size Code',
          options: [
            { label: 'Extra Small (XS)', value: 'XS' },
            { label: 'Small (S)', value: 'S' },
            { label: 'Medium (M)', value: 'M' },
            { label: 'Large (L)', value: 'L' },
            { label: 'Extra Large (XL)', value: 'XL' },
            { label: 'Double XL (XXL)', value: 'XXL' },
            { label: 'Triple XL (XXXL)', value: 'XXXL' },
            // Numeric sizes
            { label: '28', value: '28' },
            { label: '30', value: '30' },
            { label: '32', value: '32' },
            { label: '34', value: '34' },
            { label: '36', value: '36' },
            { label: '38', value: '38' },
            { label: '40', value: '40' },
            { label: '42', value: '42' },
            { label: '44', value: '44' },
            { label: '46', value: '46' },
            // Kids sizes
            { label: '2T', value: '2T' },
            { label: '3T', value: '3T' },
            { label: '4T', value: '4T' },
            { label: '5T', value: '5T' },
            { label: '6', value: '6' },
            { label: '7', value: '7' },
            { label: '8', value: '8' },
            { label: '10', value: '10' },
            { label: '12', value: '12' },
            { label: '14', value: '14' },
            { label: '16', value: '16' },
          ],
        },
        {
          name: 'inStock',
          type: 'checkbox',
          label: 'Size In Stock',
          defaultValue: true,
        },
        {
          name: 'stockQuantity',
          type: 'number',
          label: 'Stock Quantity',
          min: 0,
          defaultValue: 0,
        },
      ],
    },
    // Category and Classification
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Product Category',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Select the main category for this product',
      },
    },
    {
      name: 'subcategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Subcategories',
      admin: {
        position: 'sidebar',
        description: 'Additional categories this product belongs to',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Product Tags',
      admin: {
        position: 'sidebar',
        description: 'Tags for filtering and search (e.g., summer, casual, trending)',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    // Inventory and Stock
    {
      name: 'inStock',
      type: 'checkbox',
      label: 'In Stock',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Whether the product is currently available',
      },
    },
    {
      name: 'inventory',
      type: 'number',
      label: 'Total Inventory',
      min: 0,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total quantity available across all variants',
      },
    },
    {
      name: 'lowStockThreshold',
      type: 'number',
      label: 'Low Stock Alert Threshold',
      min: 0,
      defaultValue: 5,
      admin: {
        position: 'sidebar',
        description: 'Alert when inventory falls below this number',
      },
    },
    // Product Status and Features
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this product in featured sections',
      },
    },
    {
      name: 'isNewArrival',
      type: 'checkbox',
      label: 'New Arrival',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as new arrival',
      },
    },
    {
      name: 'isBestseller',
      type: 'checkbox',
      label: 'Bestseller',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as bestseller',
      },
    },
    {
      name: 'onSale',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'salePrice',
      type: 'number',
      admin: {
        condition: ({ onSale }) => onSale,
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Product Status',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Reviews and Ratings
    {
      name: 'rating',
      type: 'number',
      label: 'Average Rating',
      min: 0,
      max: 5,
      admin: {
        step: 0.1,
        description: 'Average customer rating (0-5 stars)',
        readOnly: true, // This should be calculated from reviews
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
      label: 'Number of Reviews',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total number of customer reviews',
        readOnly: true, // This should be calculated from reviews
      },
    },

    // Product Specifications
    {
      name: 'specifications',
      type: 'array',
      label: 'Product Specifications',
      admin: {
        description: 'Technical specifications and details',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Specification Name',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
      relationTo: 'products',
    },
    // SEO and Meta
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),

        MetaDescriptionField({}),
        PreviewField({
          // if the `generateUrl` function is configured
          hasGenerateFn: true,

          // field paths to match the target field for data
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    
    
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure inStock is set based on inventory
        if (data.inventory !== undefined) {
          data.inStock = data.inventory > 0
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log product changes
        console.log(`Product ${doc.title} was ${operation}d`)
      },
    ],
  },

  // Default sort
  defaultSort: '-createdAt',

  // Versions (for draft/published workflow)
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },

  // Timestamps
  timestamps: true,
}
