'use client'

import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'
import RichText from '@/components/RichText'
import { gsap } from 'gsap'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlockClient: React.FC<Props> = ({ className, content, style }) => {
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bannerRef.current) {
      // Initial state
      gsap.set(bannerRef.current, { opacity: 0, y: 20 })

      // Animate in
      gsap.to(bannerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <div ref={bannerRef} className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn(
          'border py-3 px-6 flex items-center rounded-lg transition-all duration-300 hover:shadow-md',
          {
            'border-border bg-card': style === 'info',
            'border-error bg-error/30': style === 'error',
            'border-success bg-success/30': style === 'success',
            'border-warning bg-warning/30': style === 'warning',
          },
        )}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
