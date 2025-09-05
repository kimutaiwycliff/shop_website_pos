'use client'

import { Product } from '@/payload-types'
import { Card, CardContent } from '../ui/card'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'
import { Media } from '../Media'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { useCart } from '@/providers/CartContext'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <Card className="w-full overflow-hidden group transition-all duration-300 hover:shadow-xl">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-[3/4] overflow-hidden">
          {product.images && typeof product.images === 'object' && product.images.length > 0 && (
            <div className="h-full w-full">
              {product.images.length > 1 ? (
                <Carousel
                  plugins={[
                    Autoplay({
                      delay: 5000,
                    }),
                    Fade(),
                  ]}
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                  className="h-full w-full"
                >
                  <CarouselContent className="h-full">
                    {product.images.map((img, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="relative h-full w-full">
                          <Media
                            fill
                            imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            priority={index === 0}
                            resource={typeof img === 'object' ? img.image : img}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <Media
                  fill
                  imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  resource={
                    typeof product.images[0] === 'object'
                      ? product.images[0].image
                      : product.images[0]
                  }
                />
              )}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg truncate">{product.title}</h3>
          <p className="text-muted-foreground">
            {typeof product.price === 'number'
              ? `${product.currency || '$'}${product.price.toFixed(2)}`
              : product.price}
          </p>
        </CardContent>
      </Link>
      <div className="p-4 pt-0">
        <Button
          className="w-full"
          style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
          onClick={(e) => {
            e.preventDefault()
            handleAddToCart()
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </Card>
  )
}
