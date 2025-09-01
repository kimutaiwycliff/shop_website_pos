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
import { useRef } from 'react'
export const CategoryShowCaseBlock: React.FC<CategoryShowCaseBlockProps> = ({
  title,
  subtitle,
  categories,
}) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
      <section className="py-12 sm:py-20">
        <div className="container max-w-screen-2xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            {title}
          </h2>
          {subtitle && <p className="text-lg md:text-xl text-center">{subtitle}</p>}
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
                      <Link
                        href={`/category/${categorySlug}`}
                        className="relative aspect-video md:aspect-[4/3] group overflow-hidden rounded-lg block"
                      >
                        {item.customImage && typeof item.customImage === 'object' && (
                          <Media
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                            priority
                            resource={item.customImage}
                          />
                        )}

                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <h3 className="text-2xl font-bold font-headline text-white">
                            {item.customTitle || categoryTitle}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
  )
}
