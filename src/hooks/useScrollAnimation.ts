'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const useScrollAnimation = () => {
  const headerRef = useRef<HTMLHeadElement>(null)

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

  return { headerRef }
}
