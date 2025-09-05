'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/payload-types'
import { toast } from 'sonner'

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
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

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id)

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
        )
      )
      toast.success(`Added ${quantity} more ${product.title} to cart. Total: ${newQuantity}`)
    } else {
      setCartItems((prevItems) => [...prevItems, { product, quantity }])
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
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
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