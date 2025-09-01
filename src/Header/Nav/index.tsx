'use client'

import React, { useState, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { Search, User, ShoppingCart, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type NavItem = NonNullable<HeaderType['navItems']>[number]

// Helper function to get URL from link
const getLinkUrl = (link: NavItem['link']) => {
  if (link.type === 'reference' && link.reference?.value) {
    const value = link.reference.value;
    return `/${link.reference.relationTo}/${
      typeof value === 'object' 
        ? value.id 
        : value.toString()
    }`;
  }
  return link.url || '#';
}

// Desktop Nav Item with Dropdown
const DesktopNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubLinks = item.subLinks && item.subLinks.length > 0
  const mainLink = item.link

  if (hasSubLinks) {
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Button variant="ghost" className="gap-1 h-auto px-3 py-2 text-sm font-medium">
          {mainLink.label}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {isOpen && (
          <div className="absolute left-0 mt-1 w-56 rounded-md border bg-popover p-1 shadow-lg animate-in fade-in-20">
            <Link
              href={getLinkUrl(mainLink)}
              className="block w-full rounded-sm px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              All {mainLink.label}
            </Link>
            {item.subLinks?.map((subItem, index) => (
              <Link
                key={index}
                href={getLinkUrl(subItem.link)}
                className="block w-full rounded-sm px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {subItem.link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Button asChild variant="ghost" className="h-auto px-3 py-2 text-sm font-medium">
      <Link href={getLinkUrl(mainLink)}>
        {mainLink.label}
      </Link>
    </Button>
  )
}

// Mobile Nav Item with Accordion
const MobileNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const mainLink = item.link
  const hasSubLinks = item.subLinks && item.subLinks.length > 0

  if (hasSubLinks) {
    return (
      <AccordionItem value={mainLink.label} className="border-b-0">
        <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
          <Link href={getLinkUrl(mainLink)} className="text-left">
            {mainLink.label}
          </Link>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-2 pl-4">
            <Link 
              href={getLinkUrl(mainLink)}
              className="text-muted-foreground hover:text-foreground"
            >
              All {mainLink.label}
            </Link>
            {item.subLinks?.map((subItem, index) => (
              <Link 
                key={index}
                href={getLinkUrl(subItem.link)}
                className="text-muted-foreground hover:text-foreground block py-1"
              >
                {subItem.link.label}
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link 
      href={getLinkUrl(mainLink)}
      className="flex items-center py-4 text-sm font-medium hover:text-primary"
    >
      {mainLink.label}
    </Link>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [cartItems, _setCartItems] = useState(0) // You'll need to implement cart logic
  const navItems = data?.navItems || []

  useEffect(() => {
    setIsMounted(true)
    // Here you would typically fetch cart items
    // For example: setCartItems(getCartItemsCount())
  }, [])

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navItems.map((item, i) => (
          <DesktopNavItem key={i} item={item} />
        ))}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1 md:space-x-2">
        <Link href="/search">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </Link>
        
        <Link href="/login">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </Link>
        
        <Link href="/cart" className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          {isMounted && cartItems > 0 && (
            <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">
              {cartItems}
            </Badge>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="p-6 pt-12">
              <Accordion type="single" collapsible className="w-full">
                {navItems.map((item, i) => (
                  <MobileNavItem key={i} item={item} />
                ))}
              </Accordion>
              
              <div className="mt-6 pt-6 border-t">
                <Link href="/search" className="flex items-center py-2 text-sm font-medium hover:text-primary">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
                <Link href="/account" className="flex items-center py-2 text-sm font-medium hover:text-primary">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Link>
                <Link href="/cart" className="flex items-center py-2 text-sm font-medium hover:text-primary">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {isMounted && cartItems > 0 && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {cartItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
