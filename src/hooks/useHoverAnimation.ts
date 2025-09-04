'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const useHoverAnimation = () => {
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const handleMouseEnter = () => {
      gsap.to(elementRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(elementRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    elementRef.current.addEventListener('mouseenter', handleMouseEnter)
    elementRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mouseenter', handleMouseEnter)
        elementRef.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return { ref: elementRef }
}
