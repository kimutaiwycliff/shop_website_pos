import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import type { CMSLinkType } from '@/components/Link'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'

interface FooterItem {
  link: CMSLinkType
  title?: string
  id?: string
}

interface FooterData {
  navItems?: FooterItem[]
  copyright?: string
}

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1-2.2.8c-.4-.1-.9-.3-1.2-.5.2 3.2-1.3 5.4-3.4 6.5-2.1 1.1-4.3.9-6.3.3-2.1-.6-4.1-2.2-5.1-4.4C2.5 10.3 4.1 6.3 7.8 4.2c3.7-2.1 7.8-1 9.2.8.6.4 1.2.7 1.8.8.6.1 1.2-.2 1.2-.2z"></path>
  </svg>
)

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterData
  const {
    copyright = `© ${new Date().getFullYear()} Your Brand. All rights reserved.`,
    navItems = [],
  } = footerData || {}

  // Convert navItems to a more usable format
  const footerNavItems = (navItems || []).map((item) => {
    const link: CMSLinkType = item.link || {
      type: 'custom',
      url: '#',
      label: item.title || 'Link',
      newTab: false,
    }
    return {
      ...item,
      link,
      title: item.title || link.label || 'Link',
    }
  })

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container max-w-screen-2xl py-12 grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {/* Brand/Description Section */}
        <div>
          <Link className="flex items-center mb-4 space-x-2" href="/">
            {/* <Logo /> */}
            <h3 className="font-bold text-lg font-headline mb-4">Luxe Collections</h3>
          <p className="text-muted-foreground text-sm">Timeless style, modern elegance. Your wardrobe, redefined.</p>
          </Link>
        </div>

        {/* Shop Links */}
        <div className="md:col-start-2">
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/shop"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/new-arrivals"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                New In
              </Link>
            </li>
            <li>
              <Link
                href="/category/dresses"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Dresses
              </Link>
            </li>
            <li>
              <Link
                href="/sale"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Sale
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links (Dynamic) */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {footerNavItems.length > 0 ? (
              footerNavItems.map(({ link, title }, i) => (
                <li key={i}>
                  <CMSLink
                    {...link}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    appearance="inline"
                  >
                    {title}
                  </CMSLink>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground text-sm">
                Add company links in the admin panel
              </li>
            )}
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="font-semibold mb-4">Stay Connected</h4>
          <p className="text-muted-foreground text-sm mb-4">
            Join our newsletter for exclusive updates.
          </p>

          <form className="flex w-full max-w-sm space-x-2 mb-4">
            <Input
              type="email"
              placeholder="Your email"
              className="bg-background flex-1"
              required
            />
            <Button type="submit" variant="default" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>

          <div className="flex space-x-4">
            <Link
              href="#"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <TwitterIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container max-w-screen-2xl py-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-4 sm:px-6 lg:px-8 gap-4">
          <p className="text-sm">{copyright}</p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="md:inline-flex">
              <ThemeSelector />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
