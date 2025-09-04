import type { Product } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type InventoryArgs = {
  products: Product[]
}

export const luxeInventory: (args: InventoryArgs) => any[] = ({ products }) => {
  // Add validation to ensure all required references exist
  if (!products) {
    throw new Error('Missing required dependencies for inventory seed')
  }
  
  // Helper function to safely get product ID
  const getProductId = (title: string) => {
    const product = products.find((p) => p.title === title)
    if (!product) {
      console.warn(`Product not found for inventory: ${title}`)
      return null
    }
    return product.id
  }
  
  const inventoryItems = [
    {
      product: getProductId('Ethereal Silk Blazer'),
      currentStock: 35,
      minStockLevel: 5,
      maxStockLevel: 50,
      reorderPoint: 10,
      status: 'in_stock',
      location: {
        warehouse: 'Nairobi Main Warehouse',
        aisle: '12',
        shelf: 'B',
        bin: '03',
      },
    },
    {
      product: getProductId('Midnight Rose Maxi Dress'),
      currentStock: 27,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 12,
      status: 'in_stock',
      location: {
        warehouse: 'Nairobi Main Warehouse',
        aisle: '08',
        shelf: 'C',
        bin: '07',
      },
    },
    {
      product: getProductId('Urban Luxe Leather Jacket'),
      currentStock: 20,
      minStockLevel: 3,
      maxStockLevel: 25,
      reorderPoint: 6,
      status: 'in_stock',
      location: {
        warehouse: 'Nairobi Main Warehouse',
        aisle: '15',
        shelf: 'A',
        bin: '01',
      },
    },
    {
      product: getProductId('Celestial Sculptural Top'),
      currentStock: 7,
      minStockLevel: 2,
      maxStockLevel: 12,
      reorderPoint: 4,
      status: 'low_stock',
      location: {
        warehouse: 'Nairobi Main Warehouse',
        aisle: '03',
        shelf: 'A',
        bin: '12',
      },
    },
    {
      product: getProductId('Aria Cashmere Cardigan'),
      currentStock: 35,
      minStockLevel: 10,
      maxStockLevel: 60,
      reorderPoint: 15,
      status: 'in_stock',
      location: {
        warehouse: 'Nairobi Main Warehouse',
        aisle: '05',
        shelf: 'B',
        bin: '15',
      },
    },
    {
      product: getProductId('Noir Minimalist Trousers'),
      currentStock: 34,
      minStockLevel: 12,
      maxStockLevel: 50,
      reorderPoint: 18,
      status: 'in_stock',
      location: {
        warehouse: 'Nairobi Main Warehouse',
        aisle: '11',
        shelf: 'C',
        bin: '09',
      },
    },
  ]
  
  // Filter out inventory items with null product references
  return inventoryItems.filter(item => {
    if (item.product === null) {
      console.warn('Inventory item has invalid product reference')
      return false
    }
    return true
  })
}
