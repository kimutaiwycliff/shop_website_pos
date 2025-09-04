'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { Post } from '@/payload-types'
import { CollectionArchive } from '@/components/CollectionArchive'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ArchiveBlockClientProps {
  posts: Post[]
  id?: string
  blockType?: string
}

export const ArchiveBlockClient: React.FC<ArchiveBlockClientProps> = ({ posts, id, blockType }) => {
  const archiveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (archiveRef.current) {
      // Initial state
      gsap.set(archiveRef.current, { opacity: 0, y: 30 })

      // Animate in
      gsap.to(archiveRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: archiveRef.current,
          start: 'top 80%',
        },
      })
    }

    // Cleanup ScrollTrigger
    return () => {
      if (typeof window !== 'undefined') {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])

  return (
    <div ref={archiveRef} className="my-16" id={`block-${id}`}>
      <CollectionArchive posts={posts} />
    </div>
  )
}
