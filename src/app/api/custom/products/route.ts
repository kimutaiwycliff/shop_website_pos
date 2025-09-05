import { NextRequest, NextResponse } from 'next/server'
import { queryProducts, searchProducts } from '@/utilities/getProductsServer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const sort = searchParams.get('sort') || '-createdAt'
    const whereParam = searchParams.get('where')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = {}

    // Parse where parameter if provided
    if (whereParam) {
      try {
        where = JSON.parse(whereParam)
      } catch (e) {
        console.error('Invalid where parameter:', e)
        return NextResponse.json({ error: 'Invalid where parameter' }, { status: 400 })
      }
    }

    let result

    // If there's a search query, use search function
    if (query && !whereParam) {
      result = await searchProducts({ query, limit, page, overrideAccess: true })
    } else {
      // Use regular query with where conditions
      result = await queryProducts({ where, limit, page, sort, overrideAccess: true })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
