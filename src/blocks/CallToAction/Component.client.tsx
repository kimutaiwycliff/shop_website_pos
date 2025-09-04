'use client'

import React, { useEffect, useRef } from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { gsap } from 'gsap'

export const CallToActionBlockClient: React.FC<CTABlockProps> = ({ links, richText }) => {
  const ctaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ctaRef.current && contentRef.current && linksRef.current) {
      // Initial state
      gsap.set([contentRef.current, linksRef.current], { opacity: 0, y: 20 })

      // Animate in with stagger
      gsap.to([contentRef.current, linksRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <div ref={ctaRef} className="container py-8">
      <div className="bg-card rounded-xl border-border border p-6 flex flex-col gap-8 md:flex-row md:justify-between md:items-center transition-all duration-300 hover:shadow-lg">
        <div ref={contentRef} className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div ref={linksRef} className="flex flex-col gap-4">
          {(links || []).map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                size="lg"
                {...link}
                className="transition-transform duration-300 hover:scale-105"
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
