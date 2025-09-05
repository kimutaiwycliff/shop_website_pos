import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { queryProductBySlug, queryProducts } from '@/utilities/getProductsServer'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { Suspense } from 'react'
import { ProductGridComponent } from '@/blocks/ProductGrid/Component'

import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import PageClient from '../page.client'
import RichText from '@/components/RichText'

export async function generateStaticParams() {
  const configPromiseResolved = await configPromise
  const payload = await getPayload({ config: configPromiseResolved })

  const products = await payload.find({
    collection: 'products',
    where: {},
    limit: 1000,
    overrideAccess: true, // Override access for static generation
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = products.docs.map((product) => {
    // Ensure slug is a string
    const slug = typeof product.slug === 'string' ? product.slug : String(product.slug)
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/products/' + slug
  const product = await queryProductBySlug({ slug, overrideAccess: true })

  if (!product) return <PayloadRedirects url={url} />

  // Get related products from the same category
  const relatedProducts = product.categories?.length
    ? await queryProducts({
        where: {
          categories: {
            in: product.categories.map((cat) => (typeof cat === 'object' ? cat.id : cat)),
          },
          id: {
            not_equals: product.id,
          },
        },
        limit: 4,
        sort: '-createdAt',
        overrideAccess: true,
      })
    : null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const primaryImage = product.images?.[0]
  const hasDiscount = product.originalPrice && product.originalPrice > (product.price || 0)
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - (product.price || 0)) / product.originalPrice!) * 100)
    : 0

  return (
    <article className="pt-16 pb-16">
      <Suspense fallback={null}>
        <PageClient />
      </Suspense>

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container mx-auto px-4">
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {primaryImage && (
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={typeof primaryImage.image === 'object' ? primaryImage.image.url || '' : ''}
                  alt={primaryImage.alt || product.title || ''}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <Badge variant="destructive" className="absolute top-4 left-4">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
            )}

            {/* Additional images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800"
                  >
                    <Image
                      src={typeof img.image === 'object' ? img.image.url || '' : ''}
                      alt={img.alt || `${product.title} image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              {product.brand && typeof product.brand === 'object' && 'name' in product.brand && (
                <p className="text-lg text-muted-foreground">{product.brand.name}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">{formatPrice(product.price || 0)}</span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {typeof cat === 'object' && 'title' in cat ? cat.title : 'Category'}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Stock:</span>
              {product.inStock > 0 ? (
                <Badge
                  variant="default"
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                >
                  {product.inStock} in stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of stock</Badge>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="text-sm text-muted-foreground">
                SKU: <span className="font-mono">{product.sku}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" disabled={product.inStock === 0}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose dark:prose-invert max-w-none">
                <h3>Description</h3>
                {/* You would render the rich text content here */}
                <RichText className="mb-6" data={product.description} enableGutter={false} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.docs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <ProductGridComponent
              blockType="productGrid"
              title=""
              displayMode="manual"
              products={relatedProducts.docs}
              limit={4}
              columns="four"
              showFilters={false}
              showSorting={false}
              showPagination={false}
              enableQuickView={true}
              enableWishlist={true}
              showCompare={false}
              cardStyle="standard"
              showProductBadges={true}
              backgroundColor="transparent"
              spacing="none"
            />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug, overrideAccess: true })

  return generateMeta({ doc: product })
}
