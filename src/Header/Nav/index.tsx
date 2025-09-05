'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Header as HeaderType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Menu, Search, User, ShoppingCart, X } from 'lucide-react'
import gsap from 'gsap'
import { useCart } from '@/providers/CartContext'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false)
  const { getCartCount } = useCart()
  const [cartItems, setCartItems] = useState(0)
  const navItems = data?.navItems || []
  const actionButtonsRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    // Set initial cart items count
    setCartItems(getCartCount())
  }, [getCartCount])

  // Update cart items count when cart changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartItems(getCartCount())
    }

    // Initial update
    updateCartCount()

    // Since we're using localStorage, we need to listen for changes
    const handleStorageChange = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [getCartCount])

  // Animation effect for action buttons
  useEffect(() => {
    if (actionButtonsRef.current) {
      gsap.fromTo(
        actionButtonsRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.2 },
      )
    }
  }, [])

  // Animation for mobile menu
  const animateMobileMenu = () => {
    if (mobileMenuRef.current) {
      const items = mobileMenuRef.current.querySelectorAll('a, button')
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
        },
      )
    }
  }

  // Render desktop navigation item
  const DesktopNavItem = ({ item }: { item: any }) => {
    if (!item.link) return null

    const href = typeof item.link === 'object' && item.link.url ? item.link.url : '#'
    const isExternal = href.startsWith('http')

    return (
      <Link
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors duration-300"
      >
        {item.label}
      </Link>
    )
  }

  // Render mobile navigation item
  const MobileNavItem = ({ item }: { item: any }) => {
    if (!item.link) return null

    const href = typeof item.link === 'object' && item.link.url ? item.link.url : '#'
    const isExternal = href.startsWith('http')

    return (
      <Link
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors duration-300"
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navItems.map((item, i) => (
          <DesktopNavItem key={i} item={item} />
        ))}
      </nav>

      {/* Mobile Menu Trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" onClick={animateMobileMenu}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <div className="flex flex-col h-full" ref={mobileMenuRef}>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menu</h2>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetTrigger>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                  {navItems.map((item, i) => (
                    <MobileNavItem key={i} item={item} />
                  ))}
                </nav>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/search"
                  className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors duration-300"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
                <Link
                  href="/account"
                  className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors duration-300"
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors duration-300"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {isMounted && cartItems > 0 && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground animate-pulse">
                      {cartItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Action Buttons */}
      <div ref={actionButtonsRef} className="flex items-center space-x-1 md:space-x-2">
        <Link href="/search">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex transition-all duration-300 hover:scale-110"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </Link>

        <Link href="/login">
          <Button
            variant="ghost"
            size="icon"
            className="transition-all duration-300 hover:scale-110"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </Link>

        <Link href="/cart" className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          {isMounted && cartItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0 animate-pulse"
            >
              {cartItems}
            </Badge>
          )}
        </Link>
      </div>
    </div>
  )
}
