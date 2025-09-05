'use client'
import { Media } from '@/components/Media'
import type { CategoryShowcaseBlock as CategoryShowCaseBlockProps } from '@/payload-types'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

export const CategoryShowCaseBlock: React.FC<CategoryShowCaseBlockProps> = ({
  title,
  subtitle,
  categories,
}) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))
  const showcaseRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showcaseRef.current && headerRef.current) {
      // Initial state
      gsap.set(headerRef.current, { opacity: 0, y: 30 })
      gsap.set(carouselRef.current, { opacity: 0, y: 30 })

      // Animate in with stagger
      gsap.to([headerRef.current, carouselRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <section ref={showcaseRef} className="py-12 sm:py-20">
      <div className="container max-w-screen-2xl">
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div ref={carouselRef}>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
          >
            <CarouselContent>
              {categories?.map((item, index) => {
                // Type guard to ensure category is an object with slug property
                const categorySlug =
                  typeof item.category === 'object' && item.category?.slug
                    ? item.category.slug
                    : null
                const categoryTitle =
                  typeof item.category === 'object' && item.category?.title
                    ? item.category.title
                    : null

                if (!categorySlug || !categoryTitle) return null
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg">
                        <Link href={`/categories/${categorySlug}`} className="block">
                          <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-t-lg">
                            {item.customImage && typeof item.customImage === 'object' && (
                              <Media
                                fill
                                imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                                priority
                                resource={item.customImage}
                              />
                            )}
                          </div>

                          <CardContent className="p-4">
                            <h3 className="font-medium text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
                              {item.customTitle || categoryTitle}
                            </h3>
                          </CardContent>
                        </Link>
                      </Card>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="transition-all duration-300 hover:scale-110" />
            <CarouselNext className="transition-all duration-300 hover:scale-110" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
