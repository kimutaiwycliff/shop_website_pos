import type { Customer, Product } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type CartArgs = {
  customers: Customer[]
  products: Product[]
}

export const luxeCartItems: (args: CartArgs) => any[] = ({ customers, products }) => {
  // Add validation to ensure all required references exist
  if (!customers || !products) {
    throw new Error('Missing required dependencies for cart seed')
  }
  
  // Helper function to safely get customer ID
  const getCustomerId = (email: string) => {
    const customer = customers.find((c) => c.email === email)
    if (!customer) {
      console.warn(`Customer not found for cart: ${email}`)
      return null
    }
    return customer.id
  }
  
  // Helper function to safely get product ID
  const getProductId = (title: string) => {
    const product = products.find((p) => p.title === title)
    if (!product) {
      console.warn(`Product not found for cart: ${title}`)
      return null
    }
    return product.id
  }
  
  const cartItems = [
    {
      customer: getCustomerId('amara.kimani@email.com'),
      sessionId: null,
      items: [
        {
          product: getProductId('Midnight Rose Maxi Dress'),
          quantity: 1,
          selectedVariants: {
            size: 'M',
            color: 'Lavender Mist',
          },
          unitPrice: 18900,
          lineTotal: 18900,
          addedAt: '2024-09-03T14:30:00Z',
        },
        {
          product: getProductId('Celestial Sculptural Top'),
          quantity: 1,
          selectedVariants: {
            size: 'M',
            color: 'Pure White',
          },
          unitPrice: 32000,
          lineTotal: 32000,
          addedAt: '2024-09-03T15:45:00Z',
        },
      ],
      itemsCount: 2,
      subtotal: 50900,
      total: 50900,
      status: 'active',
      coupon: null,
      shippingEstimate: {
        method: 'Standard Delivery',
        cost: 800,
        estimatedDays: 3,
      },
      expiresAt: '2024-10-03T14:30:00Z',
      notes: 'Customer considering these items for upcoming event',
    },
    {
      customer: null,
      sessionId: 'guest_sess_abc123xyz789',
      items: [
        {
          product: getProductId('Aria Cashmere Cardigan'),
          quantity: 1,
          selectedVariants: {
            size: 'L',
            color: 'Camel',
          },
          unitPrice: 24000,
          lineTotal: 24000,
          addedAt: '2024-09-03T10:15:00Z',
        },
      ],
      itemsCount: 1,
      subtotal: 24000,
      total: 24000,
      status: 'active',
      coupon: null,
      shippingEstimate: {
        method: 'Standard Delivery',
        cost: 800,
        estimatedDays: 3,
      },
      expiresAt: '2024-09-10T10:15:00Z',
      notes: 'Guest browsing, potential customer',
    },
    {
      customer: getCustomerId('zara.ochieng@gmail.com'),
      sessionId: null,
      items: [
        {
          product: getProductId('Urban Luxe Leather Jacket'),
          quantity: 1,
          selectedVariants: {
            size: 'S',
            color: 'Cognac Brown',
          },
          unitPrice: 45000,
          lineTotal: 45000,
          addedAt: '2024-09-02T16:20:00Z',
        },
        {
          product: getProductId('Noir Minimalist Trousers'),
          quantity: 1,
          selectedVariants: {
            size: '28',
            color: 'Navy',
          },
          unitPrice: 19500,
          lineTotal: 19500,
          addedAt: '2024-09-02T16:25:00Z',
        },
      ],
      itemsCount: 2,
      subtotal: 64500,
      total: 64500,
      status: 'active',
      coupon: {
        code: 'INFLUENCER10',
        discountType: 'percentage',
        discountValue: 10,
        discountAmount: 6450,
      },
      shippingEstimate: {
        method: 'Express Delivery',
        cost: 1500,
        estimatedDays: 2,
      },
      expiresAt: '2024-10-02T16:20:00Z',
      notes: 'Influencer customer with applied discount code',
    },
    {
      customer: getCustomerId('grace.wanjiku@corporate.co.ke'),
      sessionId: null,
      items: [
        {
          product: getProductId('Ethereal Silk Blazer'),
          quantity: 1,
          selectedVariants: {
            size: 'S',
            color: 'Sage Green',
          },
          unitPrice: 28500,
          lineTotal: 28500,
          addedAt: '2024-09-01T09:30:00Z',
        },
      ],
      itemsCount: 1,
      subtotal: 28500,
      total: 28500,
      status: 'active',
      coupon: null,
      shippingEstimate: {
        method: 'Standard Delivery',
        cost: 800,
        estimatedDays: 3,
      },
      expiresAt: '2024-10-01T09:30:00Z',
      notes: 'Professional customer building work wardrobe',
    },
    {
      customer: null,
      sessionId: 'guest_sess_def456uvw012',
      items: [
        {
          product: getProductId('Midnight Rose Maxi Dress'),
          quantity: 2,
          selectedVariants: {
            size: 'M',
            color: 'Dusty Rose',
          },
          unitPrice: 18900,
          lineTotal: 37800,
          addedAt: '2024-08-30T14:45:00Z',
        },
      ],
      itemsCount: 2,
      subtotal: 37800,
      total: 37800,
      status: 'abandoned',
      coupon: null,
      shippingEstimate: {
        method: 'Standard Delivery',
        cost: 800,
        estimatedDays: 3,
      },
      expiresAt: '2024-09-06T14:45:00Z',
      notes: 'Cart abandoned - potential recovery target',
    },
    {
      customer: getCustomerId('fatima.hassan@yahoo.com'),
      sessionId: null,
      items: [
        {
          product: getProductId('Aria Cashmere Cardigan'),
          quantity: 1,
          selectedVariants: {
            size: 'M',
            color: 'Charcoal',
          },
          unitPrice: 24000,
          lineTotal: 24000,
          addedAt: '2024-09-03T11:20:00Z',
        },
        {
          product: getProductId('Noir Minimalist Trousers'),
          quantity: 1,
          selectedVariants: {
            size: '30',
            color: 'Black',
          },
          unitPrice: 19500,
          lineTotal: 19500,
          addedAt: '2024-09-03T11:25:00Z',
        },
      ],
      itemsCount: 2,
      subtotal: 43500,
      total: 43500,
      status: 'active',
      coupon: null,
      shippingEstimate: {
        method: 'Premium Delivery',
        cost: 2000,
        estimatedDays: 1,
      },
      expiresAt: '2024-10-03T11:20:00Z',
      notes: 'VIP customer - consider offering priority checkout',
    },
  ]
  
  // Filter out cart items with null product references
  return cartItems.filter(cart => {
    const hasValidItems = cart.items.every(item => item.product !== null)
    if (!hasValidItems) {
      console.warn('Cart has invalid product references')
      return false
    }
    return true
  })
}
