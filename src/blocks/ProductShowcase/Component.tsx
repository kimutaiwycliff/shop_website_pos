import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title: string
  description?: string
  price: number
  salePrice?: number
  images: Array<{
    url: string
    alt: string
  }>
  category: {
    title: string
    slug: string
  }
  slug: string
}

interface ProductShowcaseBlockProps {
  title: string
  subtitle?: string
  layout: "grid" | "featured" | "carousel"
  products: Product[]
  showPricing: boolean
  showDescription: boolean
}

export const ProductShowcaseBlock: React.FC<ProductShowcaseBlockProps> = ({
  title,
  subtitle,
  layout = "grid",
  products,
  showPricing,
  showDescription,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images?.[0] && (
            <Image
              src={product.images[0].url || "/placeholder.svg"}
              alt={product.images[0].alt || product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {product.salePrice && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">Sale</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.title}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</CardTitle>
        {showDescription && product.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>
        )}
        {showPricing && (
          <div className="flex items-center gap-2 mb-3">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary">{formatPrice(product.salePrice)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {layout === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {layout === "featured" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products[0] && (
              <div className="lg:col-span-1">
                <ProductCard product={products[0]} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(1, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {layout === "carousel" && (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-80">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
