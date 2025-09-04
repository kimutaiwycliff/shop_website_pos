import React from 'react'
import { ProductGridBlock as ProductGridBlockType, Product } from '@/payload-types'
import { queryProducts, queryProductsByCategory, queryProductsByBrand } from '@/utilities/getProductsServer'
import { ProductGridComponent } from './Component'

type Props = ProductGridBlockType

export const ProductGridServer: React.FC<Props> = async (blockProps) => {
  const {
    displayMode = 'featured',
    categories,
    brands,
    products: manualProducts,
    limit = 12,
  } = blockProps

  let products: Product[] = []

  try {
    switch (displayMode) {
      case 'manual':
        // Use manually selected products
        if (manualProducts) {
          products = manualProducts.filter((product): product is Product => 
            typeof product === 'object' && product !== null
          )
        }
        break

      case 'category':
        // Fetch products by categories
        if (categories && categories.length > 0) {
          const categoryIds = categories.map(cat => 
            typeof cat === 'object' ? cat.id : cat
          ).filter(Boolean)
          
          if (categoryIds.length > 0) {
            const result = await queryProducts({
              where: {
                categories: {
                  in: categoryIds,
                },
              },
              limit: limit || 12,
              sort: '-createdAt',
              overrideAccess: true,
            })
            products = result.docs || []
          }
        }
        break

      case 'brand':
        // Fetch products by brands
        if (brands && brands.length > 0) {
          const brandIds = brands.map(brand => 
            typeof brand === 'object' ? brand.id : brand
          ).filter(Boolean)
          
          if (brandIds.length > 0) {
            const result = await queryProducts({
              where: {
                brand: {
                  in: brandIds,
                },
              },
              limit: limit || 12,
              sort: '-createdAt',
              overrideAccess: true,
            })
            products = result.docs || []
          }
        }
        break

      case 'latest':
        // Fetch latest products
        const latestResult = await queryProducts({
          where: {},
          limit: limit || 12,
          sort: '-createdAt',
          overrideAccess: true,
        })
        products = latestResult.docs || []
        break

      case 'bestsellers':
        // Fetch best sellers (using a search priority or featured logic)
        const bestsellersResult = await queryProducts({
          where: {
            featured: { equals: true }, // Assuming there's a featured field
          },
          limit: limit || 12,
          sort: '-searchPriority,-createdAt',
          overrideAccess: true,
        })
        products = bestsellersResult.docs || []
        break

      case 'sale':
        // Fetch products on sale (have originalPrice > price)
        const saleResult = await queryProducts({
          where: {
            originalPrice: { greater_than: 0 },
          },
          limit: limit || 12,
          sort: '-createdAt',
          overrideAccess: true,
        })
        products = saleResult.docs?.filter((product: Product) => 
          product.originalPrice && product.price && product.originalPrice > product.price
        ) as Product[] || []
        break

      case 'featured':
      default:
        // Fetch featured products (using search priority)
        const featuredResult = await queryProducts({
          where: {},
          limit: limit || 12,
          sort: '-searchPriority,-createdAt',
          overrideAccess: true,
        })
        products = featuredResult.docs || []
        break
    }
  } catch (error) {
    console.error('Error fetching products for ProductGrid:', error)
    // Fallback to empty array
    products = []
  }

  // Pass the fetched products to the client component
  return <ProductGridComponent {...blockProps} products={products} />
}