import 'server-only'

import type { Product } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'

export const queryProductBySlug = cache(async ({ slug, overrideAccess }: { slug: string; overrideAccess?: boolean }): Promise<Product | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: overrideAccess !== undefined ? overrideAccess : draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] as Product || null
})

export const queryProductById = cache(async ({ id, overrideAccess }: { id: string | number; overrideAccess?: boolean }): Promise<Product | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const product = await payload.findByID({
      collection: 'products',
      id: typeof id === 'string' ? parseInt(id) : id,
      draft,
      overrideAccess: overrideAccess !== undefined ? overrideAccess : draft,
    })

    return product as Product
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
})

export const queryProductByBarcode = cache(async ({ barcode, overrideAccess }: { barcode: string; overrideAccess?: boolean }): Promise<Product | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: overrideAccess !== undefined ? overrideAccess : draft,
    pagination: false,
    where: {
      barcode: {
        equals: barcode,
      },
    },
  })

  return result.docs?.[0] as Product || null
})

export const queryProducts = cache(async ({ 
  where = {},
  limit = 10,
  page = 1,
  sort = '-createdAt',
  select,
  overrideAccess,
}: {
  where?: any
  limit?: number
  page?: number
  sort?: string
  select?: any
  overrideAccess?: boolean
} = {}) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit,
    page,
    overrideAccess: overrideAccess !== undefined ? overrideAccess : draft,
    pagination: true,
    where,
    sort,
    ...(select && { select }),
  })

  return result as { docs: Product[]; totalDocs: number; page: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean }
})

export const queryProductsByCategory = cache(async ({ 
  categoryId,
  limit = 10,
  page = 1,
  overrideAccess 
}: { 
  categoryId: string | number
  limit?: number
  page?: number
  overrideAccess?: boolean
}) => {
  return queryProducts({
    where: {
      categories: {
        in: [categoryId],
      },
    },
    limit,
    page,
    overrideAccess,
  })
})

export const queryProductsByBrand = cache(async ({ 
  brandId,
  limit = 10,
  page = 1,
  overrideAccess 
}: { 
  brandId: string | number
  limit?: number
  page?: number
  overrideAccess?: boolean
}) => {
  return queryProducts({
    where: {
      brand: {
        equals: brandId,
      },
    },
    limit,
    page,
    overrideAccess,
  })
})

export const searchProducts = cache(async ({ 
  query,
  limit = 20,
  page = 1,
  overrideAccess 
}: { 
  query: string
  limit?: number
  page?: number
  overrideAccess?: boolean
}) => {
  return queryProducts({
    where: {
      or: [
        { title: { like: query } },
        { sku: { like: query } },
        { barcode: { equals: query } },
        { 'brand.name': { like: query } },
        { 'meta.title': { like: query } },
        { 'meta.description': { like: query } },
      ],
    },
    limit,
    page,
    sort: '-searchPriority,-createdAt',
    overrideAccess,
  })
})

// Cached versions for better performance
export const getCachedProduct = (slug: string) =>
  unstable_cache(async () => queryProductBySlug({ slug }), [`product_${slug}`], {
    tags: [`product_${slug}`, 'products'],
  })

export const getCachedProductById = (id: string | number) =>
  unstable_cache(async () => queryProductById({ id }), [`product_id_${id}`], {
    tags: [`product_id_${id}`, 'products'],
  })

export const getCachedProductByBarcode = (barcode: string) =>
  unstable_cache(async () => queryProductByBarcode({ barcode }), [`product_barcode_${barcode}`], {
    tags: [`product_barcode_${barcode}`, 'products'],
  })

export const getCachedProducts = (options: Parameters<typeof queryProducts>[0] = {}) =>
  unstable_cache(async () => queryProducts(options), ['products_list'], {
    tags: ['products'],
  })