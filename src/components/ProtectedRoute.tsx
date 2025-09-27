'use client'

import { useAuth } from '@/providers/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication is required but user is not logged in and not loading,
    // redirect to login page
    if (requireAuth && !user && !isLoading) {
      router.push(redirectTo)
    }
  }, [user, isLoading, requireAuth, router, redirectTo])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If authentication is required and user is not logged in, don't render children
  if (requireAuth && !user) {
    return null
  }

  // Render children if all conditions are met
  return <>{children}</>
}
