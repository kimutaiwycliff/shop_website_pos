'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/payload-types'
import { toast } from 'sonner'

interface CartItem {
  product: Product
  quantity: number
  // Add variant information
  selectedColor?: {
    colorName: string
    colorCode: string
    colorImage?: {
      url: string
      alt: string
    }
  }
  selectedSize?: {
    sizeName: string
    sizeCode: string
    inStock: boolean
    stockQuantity: number
  }
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: CartItem['selectedColor'],
    selectedSize?: CartItem['selectedSize'],
  ) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: CartItem['selectedColor'],
    selectedSize?: CartItem['selectedSize'],
  ) => {
    // Create a unique key for the cart item that includes variant information
    const cartItemKey = `${product.id}-${selectedColor?.colorName || 'nocolor'}-${selectedSize?.sizeName || 'nosize'}`

    const existingItem = cartItems.find((item) => {
      const itemKey = `${item.product.id}-${item.selectedColor?.colorName || 'nocolor'}-${item.selectedSize?.sizeName || 'nosize'}`
      return itemKey === cartItemKey
    })

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      // Get stock information for the selected variant
      const stockAvailable = selectedSize ? selectedSize.stockQuantity : product.inStock

      if (newQuantity > stockAvailable) {
        toast.error(`Cannot add more items. Only ${stockAvailable} in stock.`)
        return
      }

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          const itemKey = `${item.product.id}-${item.selectedColor?.colorName || 'nocolor'}-${item.selectedSize?.sizeName || 'nosize'}`
          if (itemKey === cartItemKey) {
            return { ...item, quantity: newQuantity }
          }
          return item
        }),
      )
      toast.success(`Added ${quantity} more ${product.title} to cart. Total: ${newQuantity}`)
    } else {
      // Get stock information for the selected variant
      const stockAvailable = selectedSize ? selectedSize.stockQuantity : product.inStock

      if (quantity > stockAvailable) {
        toast.error(`Cannot add more items. Only ${stockAvailable} in stock.`)
        return
      }

      const newItem: CartItem = {
        product,
        quantity,
        selectedColor,
        selectedSize,
      }

      setCartItems((prevItems) => [...prevItems, newItem])
      toast.success(`Added ${product.title} to cart`)
    }
  }

  const removeFromCart = (productId: number) => {
    const itemToRemove = cartItems.find((item) => item.product.id === productId)
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.product.title} from cart`)
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const itemToUpdate = cartItems.find((item) => item.product.id === productId)
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )
    if (itemToUpdate) {
      toast.success(`Updated ${itemToUpdate.product.title} quantity to ${quantity}`)
    }
  }

  const clearCart = () => {
    setCartItems([])
    toast.success('Cart cleared')
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
