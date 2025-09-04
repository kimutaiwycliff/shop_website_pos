'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'
import RichText from '@/components/RichText'
import { gsap } from 'gsap'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlockClient: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  const mediaRef = useRef<HTMLDivElement>(null)
  let caption
  if (media && typeof media === 'object') caption = media.caption

  useEffect(() => {
    if (mediaRef.current) {
      // Initial state
      gsap.set(mediaRef.current, { opacity: 0, scale: 0.95 })

      // Animate in
      gsap.to(mediaRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: mediaRef.current,
          start: 'top 85%',
        },
      })
    }
  }, [])

  return (
    <div
      ref={mediaRef}
      className={cn(
        'py-8',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <Media
          imgClassName={cn(
            'border border-border rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl',
            imgClassName,
          )}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6 transition-all duration-300',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
