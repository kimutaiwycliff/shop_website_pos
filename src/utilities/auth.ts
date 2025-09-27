import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User } from '@/payload-types'

/**
 * Server-side utility to get the current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const { user } = await response.json()
    return user as User
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

/**
 * Server-side utility to require authentication
 * Redirects to login page if user is not authenticated
 * @param redirectTo - Optional path to redirect to after login
 * @returns User object
 */
export async function requireAuth(redirectTo?: string) {
  const user = await getCurrentUser()

  if (!user) {
    const redirectPath = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'
    redirect(redirectPath)
  }

  return user
}

/**
 * Server-side utility to require admin role
 * Redirects to login page if user is not authenticated or doesn't have admin role
 * @returns User object with admin role
 */
export async function requireAdmin() {
  const user = await requireAuth()

  if (!user.roles?.includes('admin')) {
    redirect('/unauthorized')
  }

  return user
}

/**
 * Server-side utility to require specific roles
 * @param roles - Array of roles that are allowed
 * @returns User object with required role
 */
export async function requireRole(roles: string[]) {
  const user = await requireAuth()

  const hasRequiredRole = user.roles?.some((role) => roles.includes(role))

  if (!hasRequiredRole) {
    redirect('/unauthorized')
  }

  return user
}
