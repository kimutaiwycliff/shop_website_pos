import 'server-only'

import type { Category } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'

export const queryCategoryBySlug = cache(
  async ({
    slug,
    overrideAccess,
  }: {
    slug: string
    overrideAccess?: boolean
  }): Promise<Category | null> => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'categories',
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

    return (result.docs?.[0] as Category) || null
  },
)

export const queryCategoryById = cache(
  async ({
    id,
    overrideAccess,
  }: {
    id: string | number
    overrideAccess?: boolean
  }): Promise<Category | null> => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    try {
      const category = await payload.findByID({
        collection: 'categories',
        id: typeof id === 'string' ? parseInt(id) : id,
        draft,
        overrideAccess: overrideAccess !== undefined ? overrideAccess : draft,
      })

      return category as Category
    } catch (error) {
      console.error('Error fetching category by ID:', error)
      return null
    }
  },
)

export const queryCategories = cache(
  async ({
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
      collection: 'categories',
      draft,
      limit,
      page,
      overrideAccess: overrideAccess !== undefined ? overrideAccess : draft,
      pagination: true,
      where,
      sort,
      ...(select && { select }),
    })

    return result as {
      docs: Category[]
      totalDocs: number
      page: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  },
)

// Cached versions for better performance
export const getCachedCategory = (slug: string) =>
  unstable_cache(async () => queryCategoryBySlug({ slug }), [`category_${slug}`], {
    tags: [`category_${slug}`, 'categories'],
  })

export const getCachedCategoryById = (id: string | number) =>
  unstable_cache(async () => queryCategoryById({ id }), [`category_id_${id}`], {
    tags: [`category_id_${id}`, 'categories'],
  })

export const getCachedCategories = (options: Parameters<typeof queryCategories>[0] = {}) =>
  unstable_cache(async () => queryCategories(options), ['categories_list'], {
    tags: ['categories'],
  })
