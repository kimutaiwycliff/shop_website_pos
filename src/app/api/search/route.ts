import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const collections = searchParams.get('collections')?.split(',') || [
      'products',
      'posts',
      'brands',
    ]
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || '-searchPriority,-createdAt'
    const whereParam = searchParams.get('where')

    const payload = await getPayload({ config: configPromise })

    let where: any = {}

    if (whereParam) {
      try {
        where = JSON.parse(whereParam)
      } catch (e) {
        console.error('Invalid where parameter:', e)
      }
    }

    // If no specific where clause and we have a query, build a default search
    if (!whereParam && query) {
      where = {
        or: [
          { title: { like: query } },
          { 'meta.title': { like: query } },
          { 'meta.description': { like: query } },
          { slug: { like: query } },
        ],
      }

      // Add product-specific search fields if products are included
      if (collections.includes('products')) {
        where.or.push(
          { sku: { like: query } },
          { barcode: { equals: query } },
          { 'brand.name': { like: query } },
        )
      }
    }

    // Search in the search collection (which aggregates all searchable content)
    const results = await payload.find({
      collection: 'search',
      where,
      limit,
      sort,
      depth: 2,
    })

    // Filter results by collection if specified
    let filteredDocs = results.docs
    if (collections.length > 0) {
      filteredDocs = results.docs.filter((doc: any) => collections.includes(doc.doc?.relationTo))
    }

    // Enhance results with additional data
    const enhancedDocs = await Promise.all(
      filteredDocs.map(async (doc: any) => {
        const { doc: docRef } = doc

        if (!docRef) return doc

        try {
          // Fetch the full document to get complete data
          const fullDoc = await payload.findByID({
            collection: docRef.relationTo,
            id: docRef.value,
            depth: 1,
          })

          return {
            ...doc,
            ...fullDoc,
            collection: docRef.relationTo,
          }
        } catch (error) {
          console.error(
            `Error fetching full document for ${docRef.relationTo}:${docRef.value}`,
            error,
          )
          return doc
        }
      }),
    )

    return NextResponse.json({
      docs: enhancedDocs,
      totalDocs: filteredDocs.length,
      limit,
      totalPages: Math.ceil(filteredDocs.length / limit),
      page: 1,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Also support POST for complex queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      query,
      collections = ['products', 'posts', 'brands'],
      filters = {},
      limit = 20,
      sort,
    } = body

    const payload = await getPayload({ config: configPromise })

    const where: any = {
      or: [
        { title: { like: query } },
        { 'meta.title': { like: query } },
        { 'meta.description': { like: query } },
        { slug: { like: query } },
      ],
    }

    // Add product-specific search fields
    if (collections.includes('products')) {
      where.or.push(
        { sku: { like: query } },
        { barcode: { equals: query } },
        { 'brand.name': { like: query } },
      )
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        where[key] = value
      }
    })

    const results = await payload.find({
      collection: 'search',
      where,
      limit,
      sort: sort || '-searchPriority,-createdAt',
      depth: 2,
    })

    // Filter and enhance results
    let filteredDocs = results.docs
    if (collections.length > 0) {
      filteredDocs = results.docs.filter((doc: any) => collections.includes(doc.doc?.relationTo))
    }

    const enhancedDocs = await Promise.all(
      filteredDocs.map(async (doc: any) => {
        const { doc: docRef } = doc

        if (!docRef) return doc

        try {
          const fullDoc = await payload.findByID({
            collection: docRef.relationTo,
            id: docRef.value,
            depth: 1,
          })

          return {
            ...doc,
            ...fullDoc,
            collection: docRef.relationTo,
          }
        } catch (error) {
          console.error(
            `Error fetching full document for ${docRef.relationTo}:${docRef.value}`,
            error,
          )
          return doc
        }
      }),
    )

    return NextResponse.json({
      docs: enhancedDocs,
      totalDocs: filteredDocs.length,
      limit,
      totalPages: Math.ceil(filteredDocs.length / limit),
      page: 1,
    })
  } catch (error) {
    console.error('Search API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
