import type React from 'react'

interface Product {
  id: string
  title: string
  description?: string
  price: number
  salePrice?: number
  images: Array<{
    url: string
    alt: string
  }>
  category: {
    title: string
    slug: string
  }
  slug: string
}

interface ProductShowcaseBlockProps {
  title: string
  subtitle?: string
  layout: 'grid' | 'featured' | 'carousel'
  products: Product[]
  showPricing: boolean
  showDescription: boolean
}

export const ProductShowcaseBlock: React.FC<ProductShowcaseBlockProps> = (props) => {
  return <div>Product Showcase Block</div>
}
