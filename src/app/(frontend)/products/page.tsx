import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductGridComponent } from '@/blocks/ProductGrid/Component'
import { queryProducts } from '@/utilities/getProductsServer'
import React, { Suspense } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const products = await queryProducts({
    where: {},
    limit: 12,
    page: 1,
    sort: '-createdAt',
    overrideAccess: true,
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
        {products.totalPages > 1 && products.page && (
          <Pagination page={products.page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Luxe Products`,
  }
}