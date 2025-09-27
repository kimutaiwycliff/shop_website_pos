import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes are public (don't require authentication)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/products',
  '/products/',
  '/categories',
  '/categories/',
  '/posts',
  '/posts/',
  '/search',
  '/search/',
  '/api',
]

// Define which routes are admin-only
const adminRoutes = ['/admin', '/admin/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and API routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get('payload-token')

  // If no token and route is not public, redirect to login
  if (!token && !publicRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access admin routes, additional checks would be needed here
  // For now, we'll let Payload CMS handle admin authentication

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
