'use client'

import { Product } from '@/payload-types'
import { Card, CardContent } from '../ui/card'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'
import { Media } from '../Media'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { useCart } from '@/providers/CartContext'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)

  const hasColors = product.variants && product.variants.some((variant) => variant.color)
  const hasSizes = product.variants && product.variants.some((variant) => variant.size)

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

      // Get unique colors and sizes from variants
      const uniqueColors = product.variants
        ? Array.from(new Set(product.variants.map((v) => v.color))).filter(Boolean)
        : []
      const uniqueSizes = product.variants
        ? Array.from(new Set(product.variants.map((v) => v.size))).filter(Boolean)
        : []

      if (selectedColor !== null && uniqueColors.length > selectedColor) {
        const colorName = uniqueColors[selectedColor]
        // Find the first variant with this color to get color details
        const colorVariant = product.variants?.find((v) => v.color === colorName)
        selectedColorData = {
          colorName: colorName || '',
          colorCode: '#000000', // Default color code
          colorImage: undefined, // No color image in current structure
        }
      }

      if (selectedSize !== null && uniqueSizes.length > selectedSize) {
        const sizeName = uniqueSizes[selectedSize]
        // Find the first variant with this size to get size details
        const sizeVariant = product.variants?.find((v) => v.size === sizeName)
        selectedSizeData = {
          sizeName: sizeName || '',
          sizeCode: sizeName || '',
          inStock: (sizeVariant?.stock || 0) > 0,
          stockQuantity: sizeVariant?.stock || 0,
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
      <Card className="w-full overflow-hidden group transition-all duration-300 hover:shadow-xl">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[3/4] overflow-hidden">
            {product.images && typeof product.images === 'object' && product.images.length > 0 && (
              <div className="h-full w-full">
                {product.images.length > 1 ? (
                  <Carousel
                    plugins={[
                      Autoplay({
                        delay: 5000,
                      }),
                      Fade(),
                    ]}
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    className="h-full w-full"
                  >
                    <CarouselContent className="h-full">
                      {product.images.map((img, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="relative h-full w-full">
                            <Media
                              fill
                              imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              priority={index === 0}
                              resource={typeof img === 'object' ? img.image : img}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <Media
                    fill
                    imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                    resource={
                      typeof product.images[0] === 'object'
                        ? product.images[0].image
                        : product.images[0]
                    }
                  />
                )}
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg truncate">{product.title}</h3>
            <p className="text-muted-foreground">
              {typeof product.price === 'number'
                ? `${product.currency || '$'}${product.price.toFixed(2)}`
                : product.price}
            </p>
          </CardContent>
        </Link>
        <div className="p-4 pt-0">
          <Button
            className="w-full"
            style={{
              backgroundColor: 'hsl(var(--accent))',
              color: 'hsl(var(--accent-foreground))',
            }}
            onClick={(e) => {
              e.preventDefault()
              handleAddToCart()
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </Card>

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
              {hasColors && product.variants && (
                <div>
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Get unique colors from variants */}
                    {Array.from(new Set(product.variants.map((v) => v.color)))
                      .filter(Boolean)
                      .map((colorName: string, index: number) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            selectedColor === index
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: '#ccc' }}
                          onClick={() => setSelectedColor(index)}
                          title={colorName}
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
              {hasSizes && product.variants && (
                <div>
                  <label className="text-sm font-medium">Size</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Get unique sizes from variants */}
                    {Array.from(new Set(product.variants.map((v) => v.size)))
                      .filter(Boolean)
                      .map((sizeName: string, index: number) => {
                        // Find the first variant with this size to check stock
                        const sizeVariant = product.variants?.find((v) => v.size === sizeName)
                        const inStock = (sizeVariant?.stock || 0) > 0

                        return (
                          <button
                            key={index}
                            className={`px-3 py-2 text-sm rounded border ${
                              selectedSize === index
                                ? 'bg-primary text-primary-foreground border-primary'
                                : inStock
                                  ? 'border-gray-300 hover:border-gray-400'
                                  : 'opacity-50 cursor-not-allowed'
                            } ${!inStock ? 'line-through' : ''}`}
                            onClick={() => inStock && setSelectedSize(index)}
                            disabled={!inStock}
                            title={sizeName}
                          >
                            {sizeName}
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Stock Information */}
              {(hasColors || hasSizes) && (selectedColor !== null || selectedSize !== null) && (
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    let stockInfo = ''
                    let stockAvailable = product.inStock || 0

                    // Get unique colors and sizes from variants
                    const uniqueColors = product.variants
                      ? Array.from(new Set(product.variants.map((v) => v.color))).filter(Boolean)
                      : []
                    const uniqueSizes = product.variants
                      ? Array.from(new Set(product.variants.map((v) => v.size))).filter(Boolean)
                      : []

                    if (selectedColor !== null && uniqueColors.length > selectedColor) {
                      stockInfo += `${uniqueColors[selectedColor]}`
                    }

                    if (selectedSize !== null && uniqueSizes.length > selectedSize) {
                      const sizeName = uniqueSizes[selectedSize]
                      stockInfo += stockInfo ? ` / ${sizeName}` : sizeName
                      // Find the first variant with this size to get stock info
                      const sizeVariant = product.variants?.find((v) => v.size === sizeName)
                      stockAvailable = sizeVariant?.stock || 0
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
                  disabled={
                    Boolean(hasColors && selectedColor === null) ||
                    Boolean(hasSizes && selectedSize === null)
                  }
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
