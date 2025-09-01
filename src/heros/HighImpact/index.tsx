'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  mediaType,
  slides,
  autoplay,
  autoplayDelay,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const getTextAlignment = (position: string) => {
    switch (position) {
      case 'left':
        return 'justify-start'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-center'
    }
  }

  // Return null if no valid media type
  if (!mediaType || (mediaType === 'slider' && (!slides || slides.length === 0))) {
    return null
  }

  const renderSliderContent = () => {
    if (mediaType === 'slider' && slides && slides.length > 0) {
      return (
        <section className="w-full">
          <Carousel
            plugins={[
              Autoplay({
                delay: autoplay && autoplayDelay ? autoplayDelay * 1000 : 5000,
              }),
              Fade(),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white bg-gray-800">
                    {slide.image && typeof slide.image === 'object' && (
                      <Media
                        fill
                        imgClassName=" absolute z-0 opacity-40 object-cover hidden md:block"
                        priority
                        resource={slide.image}
                      />
                    )}
                    {slide.mobileImage && typeof slide.mobileImage === 'object' && (
                      <Media
                        fill
                        imgClassName="object-cover md:hidden"
                        priority
                        resource={slide.mobileImage}
                      />
                    )}
                    <div
                      className={cn(
                        'absolute inset-0 bg-black/10 flex items-center justify-center z-10',
                        getTextAlignment(slide?.textPosition || 'center'),
                      )}
                    >
                      <div className="text-center text-white space-y-4 px-4">
                        {slide.title && (
                          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                            {slide.title}
                          </h1>
                        )}
                        {slide.subtitle && (
                          <p className="text-xl md:text-2xl mb-8 max-w-2xl">{slide.subtitle}</p>
                        )}
                        {Array.isArray(slide.links) && slide.links.length > 0 && (
                          <ul className="flex gap-4 items-center justify-center">
                            {slide.links.map(({ link }, i) => {
                              return (
                                <li key={i}>
                                  <CMSLink {...link} />
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-none" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-none" />
          </Carousel>
        </section>
      )
    }
    return null
  }

  const renderSingleMediaContent = () => {
    if (mediaType === 'single' || (mediaType === 'video' && media && typeof media === 'object')) {
      return (
        <>
          <div className="container mb-8 z-10 relative flex items-center justify-center">
            <div className="max-w-[36.5rem] md:text-center">
              {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex md:justify-center gap-4">
                  {links.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <CMSLink {...link} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
          <div className="min-h-[80vh] select-none">
            {media && typeof media === 'object' && (
              <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
            )}
          </div>
        </>
      )
    }
    return null
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center text-white w-full h-[600px] md:h-[800px] overflow-hidden',

        mediaType === 'slider' ? '-mt-[5.4rem]' : '-mt-[10.4rem]',
      )}
      data-theme="dark"
    >
      {renderSliderContent()}
      {renderSingleMediaContent()}
    </div>
  )
}
