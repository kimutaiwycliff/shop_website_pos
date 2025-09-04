'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

import type { Header } from '@/payload-types'

import { LogoIcon } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const headerRef = useRef<HTMLHeadElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Animation effect
  useEffect(() => {
    if (headerRef.current && logoRef.current && navRef.current) {
      // Initial state
      gsap.set([headerRef.current, logoRef.current, navRef.current], { opacity: 0, y: -20 })

      // Animate in
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      })

      gsap.to([logoRef.current, navRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2,
      })
    }
  }, [])

  // Scroll effect
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      if (!headerRef.current) return

      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY
      const isPastThreshold = currentScrollY > 50

      // Update header styles based on scroll
      if (isScrollingDown && isPastThreshold) {
        gsap.to(headerRef.current, {
          y: -100,
          duration: 0.3,
          ease: 'power2.inOut',
        })
      } else {
        gsap.to(headerRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      lastScrollY = currentScrollY
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader)
        ticking = true
      }
    }

    const handleScroll = () => {
      requestTick()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex h-16 rounded-2xl bg-card/90 backdrop-blur-lg border border-border/20 shadow-lg items-center justify-between px-6 w-full max-w-7xl mx-auto">
          <Link
            ref={logoRef}
            href="/"
            className="mr-6 flex items-center space-x-2 transition-transform hover:scale-105 duration-300"
          >
            <LogoIcon className="h-8 w-8 text-primary transition-all duration-300 hover:text-primary/80" />
            <span className="font-bold text-xl font-headline bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Luxe Collections
            </span>
          </Link>
          <div ref={navRef}>
            <HeaderNav data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}
