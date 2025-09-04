'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'
import RichText from '@/components/RichText'
import { gsap } from 'gsap'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlockClient: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props
  const contentRef = useRef<HTMLDivElement>(null)

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  useEffect(() => {
    if (contentRef.current) {
      // Initial state
      gsap.set(contentRef.current, { opacity: 0, y: 30 })

      // Animate in
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
      })
    }
  }, [])

  return (
    <div ref={contentRef} className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && (
                  <CMSLink
                    {...link}
                    className="transition-colors duration-300 hover:text-primary"
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
