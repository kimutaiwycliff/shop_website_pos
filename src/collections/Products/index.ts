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
    defaultColumns: ['title', 'price', 'category', 'inStock', 'status', 'updatedAt'],
    group: 'Shop',
    description: 'Manage all products in your store',
    pagination: {
      defaultLimit: 20,
      limits: [10, 20, 50, 100],
    },
    listSearchableFields: ['title', 'sku', 'description'],
    preview: (doc) => {
      return `/products/${doc?.slug}`
    },
  },
  fields: [
    // Tabs for better organization
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            // Basic Product Information
            {
              name: 'title',
              type: 'text',
              label: 'Product Title',
              required: true,
              unique: true,
              admin: {
                description:
                  'The name of your product as it will appear to customers (max 100 characters)',
                placeholder: 'e.g., Premium Cotton T-Shirt',
              },
              maxLength: 100,
            },
            ...slugField(),
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                position: 'sidebar',
                description: 'Assign this product to one or more categories',
              },
            },
            {
              name: 'brand',
              type: 'relationship',
              relationTo: 'brands',
              admin: {
                position: 'sidebar',
                description: 'Select the brand for this product',
              },
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description:
                  'Detailed description of the product. Include key features, benefits, and specifications.',
                className: 'rich-text-editor',
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            // Product Images
            {
              name: 'images',
              type: 'array',
              label: 'Product Gallery',
              required: true,
              minRows: 1,
              maxRows: 12,
              admin: {
                description:
                  'Upload high-quality product images (min 800x800px). First image will be used as the main product image.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Upload a high-resolution product image',
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  label: 'Alt Text',
                  required: true,
                  admin: {
                    description:
                      'Describe this image for accessibility and SEO (e.g., "Red cotton t-shirt front view")',
                    placeholder: 'Briefly describe this image',
                  },
                  minLength: 5,
                  maxLength: 125,
                },
                {
                  name: 'isPrimary',
                  type: 'checkbox',
                  label: 'Set as Primary Image',
                  defaultValue: false,
                  admin: {
                    description: 'The primary image will be featured as the main product image',
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    condition: (data, siblingData, { user }) => {
                      // Only show if there are multiple images
                      if (siblingData?.images?.length > 1) return true
                      return false
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Variants',
          fields: [
            // Product Variants
            {
              name: 'colors',
              type: 'array',
              label: 'Color Options',
              admin: {
                description: 'Add all available color variations for this product',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'colorName',
                  type: 'text',
                  label: 'Color Name',
                  required: true,
                  admin: {
                    description: 'e.g., Navy Blue, Black, White',
                    placeholder: 'Enter color name',
                  },
                },
                {
                  name: 'colorCode',
                  type: 'text',
                  label: 'Color Swatch',
                  admin: {
                    description: 'Hex color code (e.g., #1A365D for navy blue)',
                    placeholder: '#1A365D',
                  },
                  validate: (val: string | null | undefined) => {
                    if (!val) return 'Color code is required'
                    return (
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val) ||
                      'Please enter a valid hex color code (e.g., #1A365D)'
                    )
                  },
                },
                {
                  name: 'colorImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Image showing this color variant',
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
          ],
        },
        {
          label: 'Pricing & Inventory',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  label: 'SKU',
                  required: true,
                  unique: true,
                  admin: {
                    width: '50%',
                    description: 'Unique product identifier',
                    placeholder: 'e.g., TSH-001-BL',
                  },
                },
                {
                  name: 'barcode',
                  type: 'text',
                  label: 'Barcode (UPC/EAN)',
                  admin: {
                    width: '50%',
                    description: 'Product barcode number',
                    placeholder: 'e.g., 123456789012',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Pricing Information',
              admin: {
                description: 'Set your product pricing and track costs',
              },
              fields: [
                {
                  name: 'costPrice',
                  type: 'number',
                  label: 'Cost Price (KES)',
                  required: true,
                  min: 0,
                  admin: {
                    step: 50,
                    description: 'Your cost for this product',
                    placeholder: '0.00',
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  label: 'Selling Price (KES)',
                  required: true,
                  min: 0,
                  admin: {
                    step: 50,
                    description: 'Price customers will pay',
                    placeholder: '0.00',
                  },
                },
                {
                  name: 'originalPrice',
                  type: 'number',
                  label: 'Compare at Price (KES)',
                  min: 0,
                  admin: {
                    step: 50,
                    description: 'Original price before discount (optional)',
                    placeholder: '0.00',
                    condition: (data) => data.price > 0,
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  validate: (val: number | null | undefined, { data }: { data: any }) => {
                    if (val && data.price && val <= data.price) {
                      return 'Compare at price must be higher than selling price'
                    }
                    return true
                  },
                },
                {
                  name: 'taxRate',
                  type: 'number',
                  label: 'Tax Rate (%)',
                  min: 0,
                  max: 100,
                  defaultValue: 16, // Standard VAT rate in Kenya
                  admin: {
                    step: 0.1,
                    description: 'VAT/tax rate applied to this product',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Inventory',
              admin: {
                description: 'Manage stock levels and tracking',
              },
              fields: [
                {
                  name: 'inStock',
                  type: 'number',
                  label: 'Stock Quantity',
                  required: true,
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    step: 1,
                    description: 'Available items in stock',
                  },
                },
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  label: 'Low Stock Alert',
                  min: 1,
                  defaultValue: 5,
                  admin: {
                    step: 1,
                    description: 'Get notified when stock reaches this level',
                  },
                },
                {
                  name: 'trackInventory',
                  type: 'checkbox',
                  label: 'Track Inventory',
                  defaultValue: true,
                  admin: {
                    description: 'Enable stock tracking for this product',
                  },
                },
              ],
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
                description: 'Select the currency for this product',
                width: '100%',
              },
            },
          ],
        },
        {
          label: 'Shipping',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'weight',
                  type: 'number',
                  label: 'Weight (kg)',
                  min: 0,
                  admin: {
                    step: 0.1,
                    width: '50%',
                    description: 'Product weight for shipping',
                  },
                },
                {
                  name: 'dimensions',
                  type: 'group',
                  label: 'Dimensions (cm)',
                  admin: {
                    width: '50%',
                    description: 'Product dimensions (L × W × H)',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'length',
                          type: 'number',
                          label: 'L',
                          min: 0,
                          admin: {
                            step: 0.1,
                            width: '33%',
                          },
                        },
                        {
                          name: 'width',
                          type: 'number',
                          label: 'W',
                          min: 0,
                          admin: {
                            step: 0.1,
                            width: '33%',
                          },
                        },
                        {
                          name: 'height',
                          type: 'number',
                          label: 'H',
                          min: 0,
                          admin: {
                            step: 0.1,
                            width: '33%',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'shippingClass',
              type: 'select',
              label: 'Shipping Class',
              options: [
                { label: 'Standard Shipping', value: 'standard' },
                { label: 'Express Shipping', value: 'express' },
                { label: 'Oversized', value: 'oversized' },
                { label: 'Fragile', value: 'fragile' },
              ],
              admin: {
                description: 'Select a shipping class for this product',
              },
            },
            {
              name: 'shippingNotes',
              type: 'textarea',
              label: 'Shipping Notes',
              admin: {
                description: 'Special instructions for shipping this product',
                placeholder: 'e.g., Requires special handling, ships separately',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Search Engine Optimization',
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
              admin: {
                description: 'Optimize how your product appears in search engines',
              },
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-set the first image as primary if none is set
        if (data.images?.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasPrimary = data.images.some((img: any) => img.isPrimary)
          if (!hasPrimary) {
            data.images[0].isPrimary = true
          }
        }

        // Auto-calculate discount percentage if original price is set
        if (data.originalPrice && data.price) {
          const discount = ((data.originalPrice - data.price) / data.originalPrice) * 100
          data.discountPercentage = Math.round(discount)
        } else {
          data.discountPercentage = 0
        }

        return data
      },
    ],
  },
  // endpoints: [
  //   {
  //     path: '/:id/inventory',
  //     method: 'get',
  //     handler: async (req, res) => {
  //       try {
  //         const { id } = req.params
  //         const product = await req.payload.findByID({
  //           collection: 'products',
  //           id,
  //           depth: 0,
  //         })

  //         if (!product) {
  //           return res.status(404).json({ error: 'Product not found' })
  //         }

  //         // Return inventory summary
  //         return res.status(200).json({
  //           inStock: product.inStock || 0,
  //           lowStock: product.lowStockThreshold || 5,
  //           isLowStock: (product.inStock || 0) <= (product.lowStockThreshold || 5),
  //           lastUpdated: product.updatedAt,
  //         })
  //       } catch (error) {
  //         console.error('Error fetching inventory:', error)
  //         return res.status(500).json({ error: 'Error fetching inventory data' })
  //       }
  //     },
  //   },
  // ],
  defaultSort: '-createdAt',
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
  timestamps: true,
}
