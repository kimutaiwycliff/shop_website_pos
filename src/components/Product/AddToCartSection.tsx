'use client'

import React, { useState } from 'react'
import { Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { useCart } from '@/providers/CartContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

interface AddToCartSectionProps {
  product: Product
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({ product }) => {
  const { addToCart } = useCart()
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)

  const hasColors = product.colors && product.colors.length > 0
  const hasSizes = product.sizes && product.sizes.length > 0

  const handleAddToCart = () => {
    if (hasColors || hasSizes) {
      // Show variant selection dialog
      setShowVariantDialog(true)
      setSelectedColor(null)
      setSelectedSize(null)
    } else {
      // No variants, add directly to cart
      addToCart(product)
    }
  }

  const handleAddToCartWithVariants = () => {
    if (hasColors || hasSizes) {
      // Create properly typed variant data
      let selectedColorData:
        | {
            colorName: string
            colorCode: string
            colorImage?: { url: string; alt: string }
          }
        | undefined = undefined

      let selectedSizeData:
        | {
            sizeName: string
            sizeCode: string
            inStock: boolean
            stockQuantity: number
          }
        | undefined = undefined

      if (selectedColor !== null && product.colors && product.colors.length > selectedColor) {
        const color = product.colors[selectedColor]
        selectedColorData = {
          colorName: color.colorName || '',
          colorCode: color.colorCode || '#000000',
          colorImage:
            color.colorImage && typeof color.colorImage === 'object'
              ? {
                  url: (color.colorImage as any).url || '',
                  alt: (color.colorImage as any).alt || '',
                }
              : undefined,
        }
      }

      if (selectedSize !== null && product.sizes && product.sizes.length > selectedSize) {
        const size = product.sizes[selectedSize]
        selectedSizeData = {
          sizeName: size.sizeName || '',
          sizeCode: size.sizeCode || '',
          inStock: size.inStock === true,
          stockQuantity: size.stockQuantity || 0,
        }
      }

      addToCart(product, 1, selectedColorData, selectedSizeData)
    } else {
      addToCart(product)
    }
    setShowVariantDialog(false)
    setSelectedColor(null)
    setSelectedSize(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
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

      {/* Variant Selection Dialog */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Select Variant</DialogTitle>
          </DialogHeader>
          {product && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {product.images?.[0] && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={
                        typeof product.images[0].image === 'object'
                          ? product.images[0].image.url || ''
                          : ''
                      }
                      alt={product.images[0].alt || product.title || ''}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{formatPrice(product.price || 0)}</p>
                </div>
              </div>

              {/* Color Selection */}
              {hasColors && product.colors && (
                <div>
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors.map((color: any, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          selectedColor === index
                            ? 'border-primary ring-2 ring-primary/30'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.colorCode || '#ccc' }}
                        onClick={() => setSelectedColor(index)}
                        title={color.colorName}
                      >
                        {selectedColor === index && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {hasSizes && product.sizes && (
                <div>
                  <label className="text-sm font-medium">Size</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map((size: any, index: number) => (
                      <button
                        key={index}
                        className={`px-3 py-2 text-sm rounded border ${
                          selectedSize === index
                            ? 'bg-primary text-primary-foreground border-primary'
                            : size.inStock === true
                              ? 'border-gray-300 hover:border-gray-400'
                              : 'opacity-50 cursor-not-allowed'
                        } ${!(size.inStock === true) ? 'line-through' : ''}`}
                        onClick={() => size.inStock === true && setSelectedSize(index)}
                        disabled={!(size.inStock === true)}
                        title={size.sizeName}
                      >
                        {size.sizeName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Information */}
              {(hasColors || hasSizes) && (selectedColor !== null || selectedSize !== null) && (
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    let stockInfo = ''
                    let stockAvailable = product.inStock || 0

                    if (
                      selectedColor !== null &&
                      product.colors &&
                      product.colors.length > selectedColor
                    ) {
                      stockInfo += `${product.colors[selectedColor].colorName}`
                    }

                    if (
                      selectedSize !== null &&
                      product.sizes &&
                      product.sizes.length > selectedSize
                    ) {
                      const size = product.sizes[selectedSize]
                      stockInfo += stockInfo ? ` / ${size.sizeName}` : size.sizeName
                      stockAvailable = size.stockQuantity || 0
                    }

                    return (
                      <p>
                        {stockInfo && `${stockInfo} - `}
                        <span className={stockAvailable > 0 ? 'text-green-600' : 'text-red-600'}>
                          {stockAvailable > 0 ? `${stockAvailable} in stock` : 'Out of stock'}
                        </span>
                      </p>
                    )
                  })()}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVariantDialog(false)
                    setSelectedColor(null)
                    setSelectedSize(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToCartWithVariants}
                  disabled={Boolean(
                    (hasColors && selectedColor === null) || (hasSizes && selectedSize === null),
                  )}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
