'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface UseInViewAnimationProps<T extends HTMLElement = HTMLElement> {
  animation?: gsap.TweenVars
  triggerOnce?: boolean
}

export const useInViewAnimation = <T extends HTMLElement = HTMLElement>({
  animation = { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  triggerOnce = false,
}: UseInViewAnimationProps<T> = {}) => {
  const elementRef = useRef<T | null>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!elementRef.current) return

    // Set initial state
    gsap.set(elementRef.current, { opacity: 0, y: 20 })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated.current || !triggerOnce) {
              gsap.to(entry.target, animation)
              if (triggerOnce) {
                hasAnimated.current = true
              }
            }
          } else if (!triggerOnce) {
            // Reset animation when element leaves view
            gsap.set(entry.target, { opacity: 0, y: 20 })
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(elementRef.current)

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [animation, triggerOnce])

  return { ref: elementRef }
}
