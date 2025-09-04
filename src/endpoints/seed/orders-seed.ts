import type { Customer, Product } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type OrderArgs = {
  customers: Customer[]
  products: Product[]
}

export const luxeOrders: (args: OrderArgs) => any[] = ({ customers, products }) => {
  // Add validation to ensure all required references exist
  if (!customers || !products) {
    throw new Error('Missing required dependencies for orders seed')
  }
  
  // Helper function to safely get customer ID
  const getCustomerId = (email: string) => {
    const customer = customers.find((c) => c.email === email)
    if (!customer) {
      console.warn(`Customer not found: ${email}`)
      return null
    }
    return customer.id
  }
  
  // Helper function to safely get product ID
  const getProductId = (title: string) => {
    const product = products.find((p) => p.title === title)
    if (!product) {
      console.warn(`Product not found: ${title}`)
      return null
    }
    return product.id
  }
  
  const orders = [
    {
      orderNumber: 'LUX-2024-001',
      customer: getCustomerId('amara.kimani@email.com'),
      items: [
        {
          product: getProductId('Ethereal Silk Blazer'),
          quantity: 1,
          price: 28500,
          selectedVariants: {
            size: 'M',
            color: 'Champagne',
          },
        },
        {
          product: getProductId('Aria Cashmere Cardigan'),
          quantity: 1,
          price: 24000,
          selectedVariants: {
            size: 'M',
            color: 'Soft Beige',
          },
        },
      ],
      subtotal: 52500,
      shipping: {
        method: 'Express Delivery',
        cost: 1500,
        address: {
          firstName: 'Amara',
          lastName: 'Kimani',
          address: '15 Lavington Gardens',
          apartment: 'Apartment 3B',
          city: 'Nairobi',
          state: 'Nairobi',
          zipCode: '00100',
          country: 'Kenya',
        },
      },
      tax: 7875,
      total: 61875,
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'txn_luxury_001_2024',
        amountPaid: 61875,
        remainingBalance: 0,
      },
      status: 'delivered',
    },
    {
      orderNumber: 'LUX-2024-002',
      customer: getCustomerId('zara.ochieng@gmail.com'),
      items: [
        {
          product: getProductId('Midnight Rose Maxi Dress'),
          quantity: 1,
          price: 18900,
          selectedVariants: {
            size: 'S',
            color: 'Dusty Rose',
          },
        },
        {
          product: getProductId('Celestial Sculptural Top'),
          quantity: 1,
          price: 32000,
          selectedVariants: {
            size: 'S',
            color: 'Pure White',
          },
        },
      ],
      subtotal: 50900,
      shipping: {
        method: 'Standard Delivery',
        cost: 800,
        address: {
          firstName: 'Zara',
          lastName: 'Ochieng',
          address: '89 Riverside Drive',
          apartment: '',
          city: 'Nairobi',
          state: 'Nairobi',
          zipCode: '00100',
          country: 'Kenya',
        },
      },
      tax: 7635,
      total: 59335,
      payment: {
        method: 'mpesa',
        status: 'paid',
        transactionId: 'MPESA_LUX_002_2024',
        amountPaid: 59335,
        remainingBalance: 0,
      },
      status: 'shipped',
    },
    {
      orderNumber: 'LUX-2024-003',
      customer: getCustomerId('fatima.hassan@yahoo.com'),
      items: [
        {
          product: getProductId('Urban Luxe Leather Jacket'),
          quantity: 1,
          price: 45000,
          selectedVariants: {
            size: 'M',
            color: 'Jet Black',
          },
        },
      ],
      subtotal: 45000,
      shipping: {
        method: 'Premium Delivery',
        cost: 2000,
        address: {
          firstName: 'Fatima',
          lastName: 'Hassan',
          address: '67 Muthaiga Road',
          apartment: '',
          city: 'Nairobi',
          state: 'Nairobi',
          zipCode: '00621',
          country: 'Kenya',
        },
      },
      tax: 6750,
      total: 53750,
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'visa_lux_003_2024',
        amountPaid: 53750,
        remainingBalance: 0,
      },
      status: 'delivered',
    },
    {
      orderNumber: 'LUX-2024-004',
      customer: getCustomerId('grace.wanjiku@corporate.co.ke'),
      items: [
        {
          product: getProductId('Noir Minimalist Trousers'),
          quantity: 2,
          price: 19500,
          selectedVariants: {
            size: '28',
            color: 'Black',
          },
        },
        {
          product: getProductId('Aria Cashmere Cardigan'),
          quantity: 1,
          price: 24000,
          selectedVariants: {
            size: 'S',
            color: 'Charcoal',
          },
        },
      ],
      subtotal: 63000,
      shipping: {
        method: 'Standard Delivery',
        cost: 800,
        address: {
          firstName: 'Grace',
          lastName: 'Wanjiku',
          address: '34 Kileleshwa Lane',
          apartment: 'House 12',
          city: 'Nairobi',
          state: 'Nairobi',
          zipCode: '00800',
          country: 'Kenya',
        },
      },
      tax: 9450,
      total: 73250,
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'BT_LUX_004_2024',
        amountPaid: 73250,
        remainingBalance: 0,
      },
      status: 'processing',
    },
    {
      orderNumber: 'LUX-2024-005',
      customer: getCustomerId('priya.patel@business.com'),
      items: [
        {
          product: getProductId('Ethereal Silk Blazer'),
          quantity: 1,
          price: 28500,
          selectedVariants: {
            size: 'L',
            color: 'Midnight Navy',
          },
        },
        {
          product: getProductId('Midnight Rose Maxi Dress'),
          quantity: 1,
          price: 18900,
          selectedVariants: {
            size: 'L',
            color: 'Ivory Cream',
          },
        },
      ],
      subtotal: 47400,
      shipping: {
        method: 'Express Delivery',
        cost: 1500,
        address: {
          firstName: 'Priya',
          lastName: 'Patel',
          address: '78 Parklands Avenue',
          apartment: '',
          city: 'Nairobi',
          state: 'Nairobi',
          zipCode: '00400',
          country: 'Kenya',
        },
      },
      tax: 7110,
      total: 56010,
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'amex_lux_005_2024',
        amountPaid: 56010,
        remainingBalance: 0,
      },
      status: 'confirmed',
    },
    {
      orderNumber: 'LUX-2024-006',
      customer: getCustomerId('aisha.mwangi@creative.co.ke'),
      items: [
        {
          product: getProductId('Celestial Sculptural Top'),
          quantity: 1,
          price: 32000,
          selectedVariants: {
            size: 'M',
            color: 'Silver Metallic',
          },
        },
        {
          product: getProductId('Urban Luxe Leather Jacket'),
          quantity: 1,
          price: 45000,
          selectedVariants: {
            size: 'M',
            color: 'Charcoal Gray',
          },
        },
      ],
      subtotal: 77000,
      shipping: {
        method: 'Premium Delivery',
        cost: 2000,
        address: {
          firstName: 'Aisha',
          lastName: 'Mwangi',
          address: '92 Spring Valley Road',
          apartment: '',
          city: 'Nairobi',
          state: 'Nairobi',
          zipCode: '00100',
          country: 'Kenya',
        },
      },
      tax: 11550,
      total: 90550,
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'mc_lux_006_2024',
        amountPaid: 90550,
        remainingBalance: 0,
      },
      status: 'delivered',
    },
  ]
  
  // Filter out orders with null customer or product references
  return orders.filter(order => {
    const hasValidCustomer = order.customer !== null
    const hasValidItems = order.items.every(item => item.product !== null)
    if (!hasValidCustomer) {
      console.warn(`Order ${order.orderNumber} has invalid customer reference`)
    }
    if (!hasValidItems) {
      console.warn(`Order ${order.orderNumber} has invalid product references`)
    }
    return hasValidCustomer && hasValidItems
  })
}
