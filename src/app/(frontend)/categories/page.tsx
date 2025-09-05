import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { queryCategories } from '@/utilities/getCategoriesServer'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const categories = await queryCategories({
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
          <h1>Categories</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="categories"
          currentPage={categories.page}
          limit={12}
          totalDocs={categories.totalDocs}
        />
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.docs.map((category) => (
            <div key={category.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <a href={`/categories/${category.slug}`} className="hover:underline">
                    {category.title}
                  </a>
                </h2>
                {category.parent && typeof category.parent === 'object' && 'title' in category.parent && (
                  <p className="text-muted-foreground text-sm">
                    Parent: {category.parent.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-8">
        {categories.totalPages > 1 && categories.page && (
          <Pagination page={categories.page} totalPages={categories.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const configPromiseResolved = await configPromise
  const payload = await getPayload({ config: configPromiseResolved })
  
  const { totalDocs } = await payload.count({
    collection: 'categories',
    overrideAccess: true, // Override access for static generation
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { pageNumber: string }[] = []

  // Only generate the first page as the main page, but we could generate more if needed
  if (totalPages > 1) {
    pages.push({ pageNumber: '1' })
  }

  return pages
}

export function generateMetadata(): Metadata {
  return {
    title: `Luxe Categories`,
  }
}