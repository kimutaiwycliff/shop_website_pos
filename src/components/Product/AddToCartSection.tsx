'use client'

import React from 'react'
import { Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { useCart } from '@/providers/CartContext'

interface AddToCartSectionProps {
  product: Product
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="flex gap-4">
      <Button
        size="lg"
        className="flex-1"
        disabled={product.inStock === 0}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart
      </Button>
      <Button size="lg" variant="outline">
        <Heart className="h-5 w-5" />
      </Button>
      <Button size="lg" variant="outline">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
