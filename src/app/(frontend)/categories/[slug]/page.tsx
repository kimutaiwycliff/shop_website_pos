import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { queryCategoryBySlug, queryCategories } from '@/utilities/getCategoriesServer'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { Suspense } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from '@/app/(frontend)/categories/[slug]/page.client'
import { queryProducts } from '@/utilities/getProductsServer'
import { ProductGridComponent } from '@/blocks/ProductGrid/Component'

export async function generateStaticParams() {
  const configPromiseResolved = await configPromise
  const payload = await getPayload({ config: configPromiseResolved })

  const categories = await payload.find({
    collection: 'categories',
    where: {},
    limit: 1000,
    overrideAccess: true, // Override access for static generation
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = categories.docs.map((category) => {
    // Ensure slug is a string
    const slug = typeof category.slug === 'string' ? category.slug : String(category.slug)
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/categories/' + slug
  const category = await queryCategoryBySlug({ slug, overrideAccess: true })

  if (!category) return <PayloadRedirects url={url} />

  // Get products in this category
  const products = await queryProducts({
    where: {
      categories: {
        in: [category.id],
      },
    },
    limit: 12,
    sort: '-createdAt',
    overrideAccess: true,
  })

  // Get subcategories
  const subcategories = await queryCategories({
    where: {
      parent: {
        equals: category.id,
      },
    },
    limit: 100,
    overrideAccess: true,
  })

  return (
    <article className="pt-16 pb-16">
      <Suspense fallback={null}>
        <PageClient />
      </Suspense>

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
          {category.parent && typeof category.parent === 'object' && 'title' in category.parent && (
            <p className="text-lg text-muted-foreground">
              Subcategory of{' '}
              <a href={`/categories/${category.parent.slug}`} className="underline">
                {category.parent.title}
              </a>
            </p>
          )}
        </div>

        {/* Subcategories */}
        {subcategories.docs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Subcategories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.docs.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold">
                    <a href={`/categories/${subcategory.slug}`} className="hover:underline">
                      {subcategory.title}
                    </a>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products in Category */}
        {products.docs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Products in {category.title}</h2>
            <ProductGridComponent
              blockType="productGrid"
              title=""
              displayMode="manual"
              products={products.docs}
              limit={12}
              columns="four"
              showFilters={true}
              showSorting={true}
              showPagination={true}
              enableQuickView={true}
              enableWishlist={true}
              showCompare={false}
              cardStyle="standard"
              showProductBadges={true}
              backgroundColor="transparent"
              spacing="normal"
            />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const category = await queryCategoryBySlug({ slug, overrideAccess: true })

  return generateMeta({ doc: category })
}
