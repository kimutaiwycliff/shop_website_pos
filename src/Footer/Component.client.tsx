'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { gsap } from 'gsap'
import { useInViewAnimation } from '@/hooks/useInViewAnimation'

import type { CMSLinkType } from '@/components/Link'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'

interface FooterClientProps {
  copyright?: string
  navItems?: Array<{
    link: CMSLinkType
    title?: string
    id?: string
  }>
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

export const FooterClient: React.FC<FooterClientProps> = ({ copyright, navItems = [] }) => {
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

  // Animation effects
  const footerRef = useRef<HTMLDivElement>(null)
  const brandSectionRef = useInViewAnimation<HTMLDivElement>()
  const shopSectionRef = useInViewAnimation<HTMLDivElement>()
  const companySectionRef = useInViewAnimation<HTMLDivElement>()
  const newsletterSectionRef = useInViewAnimation<HTMLDivElement>()
  const bottomSectionRef = useInViewAnimation<HTMLDivElement>()

  useEffect(() => {
    if (footerRef.current) {
      // Initial state
      gsap.set(footerRef.current, { opacity: 0, y: 30 })

      // Animate in
      gsap.to(footerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2,
      })
    }
  }, [])

  return (
    <footer className="bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={footerRef}
          className="rounded-t-2xl rounded-b-none md:rounded-t-3xl bg-card/90 backdrop-blur-lg border  shadow-lg w-full max-w-7xl mx-auto overflow-hidden"
        >
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8 px-6 sm:px-8">
            {/* Brand/Description Section */}
            <div ref={brandSectionRef.ref}>
              <Link className="flex items-center mb-4 space-x-2" href="/">
                <h3 className="font-bold text-xl font-headline mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Luxe Collections
                </h3>
                <p className="text-muted-foreground text-sm">
                  Timeless style, modern elegance. Your wardrobe, redefined.
                </p>
              </Link>

              <div className="flex space-x-4 mt-4">
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-300"
                >
                  <InstagramIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-300"
                >
                  <FacebookIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="Twitter"
                  className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-300"
                >
                  <TwitterIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Shop Links */}
            <div ref={shopSectionRef.ref} className="md:col-start-2">
              <h4 className="font-semibold mb-4 text-lg relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-primary after:transition-all after:duration-500 hover:after:w-full">
                Shop
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories/new-arrivals"
                    className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    New In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories/dresses"
                    className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    Dresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="categories/sale"
                    className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links (Dynamic) */}
            <div ref={companySectionRef.ref}>
              <h4 className="font-semibold mb-4 text-lg relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-primary after:transition-all after:duration-500 hover:after:w-full">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                {footerNavItems.length > 0 ? (
                  footerNavItems.map(({ link, title }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block"
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
            <div ref={newsletterSectionRef.ref}>
              <h4 className="font-semibold mb-4 text-lg relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-primary after:transition-all after:duration-500 hover:after:w-full">
                Stay Connected
              </h4>
              <p className="text-muted-foreground text-sm mb-4">
                Join our newsletter for exclusive updates.
              </p>

              <form className="flex w-full max-w-sm space-x-2 mb-4">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-background flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary"
                  required
                />
                <Button
                  type="submit"
                  variant="default"
                  className="whitespace-nowrap transition-all duration-300 hover:scale-105"
                >
                  Subscribe
                </Button>
              </form>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm">Follow us for daily inspiration</p>
              </div>
            </div>
          </div>

          <div ref={bottomSectionRef.ref} className="border-t ">
            <div className="py-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-6 sm:px-8 gap-4">
              <p className="text-sm">{copyright}</p>
              <div className="flex items-center space-x-4">
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors hover:underline"
                >
                  Privacy Policy
                </Link>
                <span className="text-border">•</span>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors hover:underline"
                >
                  Terms of Service
                </Link>
                <span className="md:inline-flex">
                  <ThemeSelector />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
