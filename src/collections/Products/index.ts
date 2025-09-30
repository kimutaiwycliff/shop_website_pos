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
import { generateUPCAFromSKU } from '@/lib/barcodeUtils'
import { anyone } from '@/access/anyone'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
              name: 'supplier',
              type: 'relationship',
              relationTo: 'suppliers',
              admin: {
                position: 'sidebar',
                description: 'Select the primary supplier for this product',
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
            // Product Variants - Replacing separate colors and sizes arrays with integrated variants
            {
              name: 'variants',
              type: 'array',
              label: 'Product Variants',
              admin: {
                description:
                  'Create variants by combining colors and sizes with individual stock levels',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'color',
                      type: 'text',
                      label: 'Color',
                      required: true,
                      admin: {
                        width: '50%',
                        description: 'e.g., Navy Blue, Black, White',
                        placeholder: 'Enter color name',
                      },
                    },
                    {
                      name: 'size',
                      type: 'text',
                      label: 'Size',
                      required: true,
                      admin: {
                        width: '50%',
                        description: 'e.g., Small, Medium, Large or numeric sizes',
                        placeholder: 'Enter size',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sku',
                      type: 'text',
                      label: 'Variant SKU',
                      required: true,
                      unique: true,
                      admin: {
                        width: '50%',
                        description: 'Unique SKU for this specific variant',
                        placeholder: 'e.g., TSH-001-BL-S',
                      },
                    },
                    {
                      name: 'barcode',
                      type: 'text',
                      label: 'Barcode (UPC/EAN)',
                      admin: {
                        width: '50%',
                        description: 'Barcode for this variant (auto-generated if empty)',
                        placeholder: 'e.g., 123456789012',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'stock',
                      type: 'number',
                      label: 'Stock Quantity',
                      required: true,
                      min: 0,
                      defaultValue: 0,
                      admin: {
                        width: '33%',
                        description: 'Available items in stock for this variant',
                        step: 1,
                      },
                    },
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Selling Price (KES)',
                      required: true,
                      min: 0,
                      admin: {
                        width: '33%',
                        description: 'Price for this specific variant',
                        step: 50,
                        placeholder: '0.00',
                      },
                    },
                    {
                      name: 'costPrice',
                      type: 'number',
                      label: 'Cost Price (KES)',
                      required: true,
                      min: 0,
                      admin: {
                        width: '34%',
                        description: 'Your cost for this variant',
                        step: 50,
                        placeholder: '0.00',
                      },
                    },
                  ],
                },
                {
                  name: 'isActive',
                  type: 'checkbox',
                  label: 'Active',
                  defaultValue: true,
                  admin: {
                    description: 'Uncheck to hide this variant from customers',
                  },
                },
                {
                  name: 'images',
                  type: 'array',
                  label: 'Variant Images',
                  admin: {
                    description: 'Optional images specific to this variant',
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      admin: {
                        description: 'Upload an image for this variant',
                      },
                    },
                    {
                      name: 'alt',
                      type: 'text',
                      label: 'Alt Text',
                      required: true,
                      admin: {
                        description:
                          'Describe this image for accessibility and SEO (e.g., "Blue cotton t-shirt size small front view")',
                        placeholder: 'Briefly describe this image',
                      },
                      minLength: 5,
                      maxLength: 125,
                    },
                  ],
                },
              ],
            },
            // Remove the old colors and sizes arrays as they're now replaced by variants
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
                    description: 'Product barcode number (will be auto-generated if empty)',
                    placeholder: 'e.g., 123456789012',
                  },
                },
              ],
            },
            {
              name: 'barcodeImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Barcode Image',
              admin: {
                description: 'Auto-generated UPC-A barcode image (generated from SKU)',
                readOnly: true,
              },
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
                {
                  name: 'maxDiscountPercent',
                  type: 'number',
                  label: 'Maximum Discount Percentage',
                  min: 0,
                  max: 100,
                  defaultValue: 50,
                  admin: {
                    step: 1,
                    description: 'Maximum discount percentage allowed for this product (0-100%)',
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
                {
                  name: 'status',
                  type: 'select',
                  label: 'Product Status',
                  defaultValue: 'published',
                  options: [
                    {
                      label: 'Published',
                      value: 'published',
                    },
                    {
                      label: 'Draft',
                      value: 'draft',
                    },
                    {
                      label: 'Out of Stock',
                      value: 'out-of-stock',
                    },
                  ],
                  admin: {
                    description: 'Current status of the product',
                    position: 'sidebar',
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
    beforeValidate: [
      async ({ data }) => {
        // Ensure we have data to work with
        if (!data) return data

        // Calculate total stock from variants
        let totalStock = 0
        if (data.variants && Array.isArray(data.variants)) {
          data.variants.forEach((variant) => {
            if (typeof variant.stock === 'number' && variant.isActive !== false) {
              totalStock += variant.stock
            }
          })
        }

        // Set the main product stock to the total of all variants
        data.inStock = totalStock

        // Update status based on stock level
        if (data.inStock === 0) {
          data.status = 'out-of-stock'
        } else if (data.status === 'out-of-stock' && data.inStock > 0) {
          // If stock is added to an out-of-stock item, update status
          data.status = 'published'
        }

        return data
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // Ensure we have data to work with
        if (!data) return data

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

        // Generate barcode for main product if not provided
        if (data.sku && !data.barcode) {
          data.barcode = generateUPCAFromSKU(data.sku)
        }

        // Generate barcodes for variants if not provided
        if (data.variants && Array.isArray(data.variants)) {
          data.variants = data.variants.map((variant) => {
            if (variant.sku && !variant.barcode) {
              return {
                ...variant,
                barcode: generateUPCAFromSKU(variant.sku),
              }
            }
            return variant
          })
        }

        // If this is an update operation, check stock changes
        if (originalDoc && originalDoc.inStock !== data.inStock) {
          const stockDifference = data.inStock - (originalDoc.inStock || 0)

          // Log stock changes for audit purposes
          if (stockDifference !== 0) {
            console.log(`Product ${data.title} stock changed by ${stockDifference} units`)
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Generate barcode image for main product after product creation/update (server-side only)
        if (
          typeof window === 'undefined' &&
          doc.sku &&
          (!doc.barcodeImage || operation === 'create')
        ) {
          try {
            // Dynamic import for server-only functionality
            const { createBarcodeMedia } = await import('@/lib/barcodeServerOnly')

            const barcodeImageId = await createBarcodeMedia(req.payload, doc.sku, doc.title)

            if (barcodeImageId) {
              // Update the product with the barcode image
              await req.payload.update({
                collection: 'products',
                id: doc.id,
                data: {
                  barcodeImage: barcodeImageId,
                } as any, // Temporary type assertion to handle the missing field in generated types
              })
            }
          } catch (error) {
            // Log the error but don't prevent the operation from completing
            console.error('Error generating barcode image for main product:', error)
          }
        }

        // Generate barcode images for variants (server-side only)
        if (
          typeof window === 'undefined' &&
          doc.variants &&
          Array.isArray(doc.variants) &&
          doc.variants.length > 0
        ) {
          try {
            // Dynamic import for server-only functionality
            const { createBarcodeMedia } = await import('@/lib/barcodeServerOnly')

            // Process each variant
            for (const variant of doc.variants) {
              // Only generate if the variant has a SKU and doesn't already have a barcode image
              if (variant.sku) {
                // Note: In a real implementation, you might want to store variant barcode images
                // This is a simplified version that just generates them
                await createBarcodeMedia(
                  req.payload,
                  variant.sku,
                  `${doc.title} - ${variant.color} ${variant.size}`,
                )
              }
            }
          } catch (error) {
            console.error('Error generating barcode images for variants:', error)
          }
        }

        // Check if stock has reached zero and update status accordingly
        if (doc.inStock === 0) {
          try {
            await req.payload.update({
              collection: 'products',
              id: doc.id,
              data: {
                status: 'out-of-stock', // Use the correct status value
              } as any,
            })
          } catch (error) {
            console.error('Error updating product status:', error)
          }
        }
      },
    ],
    // Add afterDelete hook to handle cleanup if needed
    afterDelete: [
      async ({ doc, req }) => {
        // Any cleanup operations when a product is deleted
        console.log('Product deleted:', doc.id)
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
