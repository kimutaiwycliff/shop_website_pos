import { NextRequest, NextResponse } from 'next/server'
import { queryProductById } from '@/utilities/getProductsServer'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const product = await queryProductById({ id, overrideAccess: true })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product by ID API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}