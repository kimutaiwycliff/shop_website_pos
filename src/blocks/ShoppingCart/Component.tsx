'use client'

import React, { useState, useMemo } from 'react'
import { ShoppingCartBlock as ShoppingCartBlockType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Heart,
  ArrowLeft,
  ArrowRight,
  Truck,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/providers/CartContext'

type Props = ShoppingCartBlockType

const ShoppingCartComponent: React.FC<Props> = ({
  title = 'Shopping Cart',
  showRecommendations = true,
  enablePromoCode = true,
  enableSaveForLater = true,
  continueShoppingUrl = '/shop',
  checkoutUrl = '/checkout',
}) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Additional configuration - these would typically come from site settings or environment
  const showEstimatedDelivery = true
  const emptyCartMessage = 'Your cart is empty. Continue shopping to find products you love!'
  const freeShippingThreshold = 5000 // KES 5,000 for free shipping
  const taxRate = 16 // 16% VAT

  const subtotal = getCartTotal()

  const taxAmount = useMemo(() => {
    return (subtotal * taxRate) / 100
  }, [subtotal, taxRate])

  const shippingCost = useMemo(() => {
    if (freeShippingThreshold && subtotal >= freeShippingThreshold) {
      return 0
    }
    return 500 // Default shipping cost
  }, [subtotal, freeShippingThreshold])

  const total = useMemo(() => {
    return subtotal + taxAmount + shippingCost - promoDiscount
  }, [subtotal, taxAmount, shippingCost, promoDiscount])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId)
  }

  const handleSaveForLater = (productId: number) => {
    // In a real app, this would move the item to a wishlist
    console.log('Save for later:', productId)
    removeFromCart(productId)
  }

  const applyPromoCode = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'save10') {
        setAppliedPromoCode(promoCode)
        setPromoDiscount(subtotal * 0.1) // 10% discount
      } else {
        alert('Invalid promo code')
      }
      setLoading(false)
    }, 1000)
  }

  const removePromoCode = () => {
    setAppliedPromoCode(null)
    setPromoDiscount(0)
    setPromoCode('')
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">{emptyCartMessage}</p>
            <Link href={continueShoppingUrl || '/shop'}>
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const primaryImage = item.product.images?.[0]
                const hasDiscount =
                  item.product.originalPrice &&
                  item.product.originalPrice > (item.product.price || 0)

                return (
                  <Card key={item.product.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        {primaryImage && typeof primaryImage.image === 'object' && (
                          <div className="w-full sm:w-24 h-24 flex-shrink-0">
                            <Image
                              src={primaryImage.image.url || ''}
                              alt={primaryImage.image.alt || item.product.title || ''}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        )}

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {item.product.title}
                              </Link>
                              {item.product.brand && typeof item.product.brand === 'object' && (
                                <p className="text-sm text-muted-foreground">
                                  {item.product.brand.name}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <Label className="text-sm">Quantity:</Label>
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item.product.id, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item.product.id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= item.product.inStock}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatPrice((item.product.price || 0) * item.quantity)}
                              </div>
                              {hasDiscount && (
                                <div className="text-sm text-muted-foreground line-through">
                                  {formatPrice((item.product.originalPrice || 0) * item.quantity)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4">
                            {enableSaveForLater && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveForLater(item.product.id)}
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                Save for Later
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              {enablePromoCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Tag className="h-5 w-5" />
                      Promo Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedPromoCode ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <span className="font-medium text-green-700 dark:text-green-400">
                          {appliedPromoCode}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removePromoCode}
                          className="text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button onClick={applyPromoCode} disabled={!promoCode || loading}>
                          Apply
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount ({appliedPromoCode})</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  {freeShippingThreshold && subtotal < freeShippingThreshold && (
                    <div className="text-sm text-muted-foreground">
                      Add {formatPrice(freeShippingThreshold - subtotal)} more for free shipping!
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax (VAT {taxRate}%)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {showEstimatedDelivery && (
                    <div className="text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Estimated delivery: 2-3 business days
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href={checkoutUrl || '/checkout'} className="w-full">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link href={continueShoppingUrl || '/shop'}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {showRecommendations && cartItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            {/* This would render a ProductGrid component with recommended products */}
            <div className="text-center text-muted-foreground py-8">
              Recommended products would appear here
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ShoppingCartComponent
