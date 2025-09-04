import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductGridComponent } from '@/blocks/ProductGrid/Component'
import { queryProducts } from '@/utilities/getProductsServer'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const products = await queryProducts({
    limit: 12,
    page: sanitizedPageNumber,
    sort: '-createdAt',
  })

  return (
    <div className="pt-24 pb-24">
      <Suspense fallback={null}>
        <PageClient />
      </Suspense>
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Products</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="products"
          currentPage={products.page}
          limit={12}
          totalDocs={products.totalDocs}
        />
      </div>

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

      <div className="container">
        {products?.page && products?.totalPages > 1 && (
          <Pagination page={products.page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Luxe Products Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const configPromiseResolved = await configPromise
  const payload = await getPayload({ config: configPromiseResolved })
  
  const { totalDocs } = await payload.count({
    collection: 'products',
    overrideAccess: true, // Override access for static generation
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}