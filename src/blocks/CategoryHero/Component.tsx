'use client'

import type React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Category {
  id: string
  title: string
  description?: string
  slug: string
  productCount?: number
}

interface CategoryHeroBlockProps {
  category: Category
  title: string
  description?: string
  backgroundImage?: {
    url: string
    alt: string
  }
  showProductCount: boolean
  layout: 'centered' | 'left' | 'right'
}

export const CategoryHeroBlock: React.FC<CategoryHeroBlockProps> = ({
  category,
  title,
  description,
  backgroundImage,
  showProductCount,
  layout,
}) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const countRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getLayoutClasses = () => {
    switch (layout) {
      case 'left':
        return 'text-left items-start'
      case 'right':
        return 'text-right items-end'
      default:
        return 'text-center items-center'
    }
  }

  useEffect(() => {
    if (heroRef.current && contentRef.current) {
      // Initial state
      gsap.set(
        [
          badgeRef.current,
          titleRef.current,
          descriptionRef.current,
          countRef.current,
          buttonRef.current,
        ],
        {
          opacity: 0,
          y: 30,
        },
      )

      // Animate in with stagger
      gsap.to(
        [
          badgeRef.current,
          titleRef.current,
          descriptionRef.current,
          countRef.current,
          buttonRef.current,
        ],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        },
      )
    }
  }, [])

  return (
    <section ref={heroRef} className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url || '/placeholder.svg'}
            alt={backgroundImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div
            ref={contentRef}
            className={`flex flex-col ${getLayoutClasses()} max-w-3xl ${layout === 'right' ? 'ml-auto' : layout === 'centered' ? 'mx-auto' : ''}`}
          >
            <div ref={badgeRef}>
              <Badge className="mb-4 w-fit bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary">
                {category.title}
              </Badge>
            </div>

            <h1
              ref={titleRef}
              className={`text-4xl md:text-6xl font-bold mb-6 ${backgroundImage ? 'text-white' : 'text-foreground'} transition-all duration-300`}
            >
              {title}
            </h1>

            {description && (
              <p
                ref={descriptionRef}
                className={`text-lg md:text-xl mb-8 leading-relaxed max-w-2xl ${backgroundImage ? 'text-gray-200' : 'text-muted-foreground'} transition-all duration-300`}
              >
                {description}
              </p>
            )}

            {showProductCount && category.productCount && (
              <div ref={countRef} className="flex items-center gap-2 mb-8">
                <span
                  className={`text-sm font-medium ${backgroundImage ? 'text-gray-300' : 'text-muted-foreground'} transition-all duration-300`}
                >
                  {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}{' '}
                  Available
                </span>
              </div>
            )}

            <Button
              ref={buttonRef}
              variant="outline"
              size="sm"
              className={`w-fit ${backgroundImage ? 'border-white text-white hover:bg-white hover:text-gray-900' : ''} transition-all duration-300 hover:scale-105`}
              onClick={() => {
                const nextSection = document.querySelector('[data-scroll-target]')
                nextSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Collection
              <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-y-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
