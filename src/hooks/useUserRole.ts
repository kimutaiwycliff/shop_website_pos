import { useAuth } from '@/providers/AuthContext'

/**
 * Hook to check if the current user has specific roles
 * @param roles - Array of roles to check for
 * @returns Object with helper functions to check roles
 */
export function useUserRole(roles?: ('admin' | 'editor' | 'user')[]) {
  const { user } = useAuth()

  const hasRole = (role: 'admin' | 'editor' | 'user') => {
    return user?.roles?.includes(role) || false
  }

  const hasAnyRole = (rolesToCheck: ('admin' | 'editor' | 'user')[]) => {
    return rolesToCheck.some((role) => hasRole(role))
  }

  const hasAllRoles = (rolesToCheck: ('admin' | 'editor' | 'user')[]) => {
    return rolesToCheck.every((role) => hasRole(role))
  }

  const isAdmin = hasRole('admin')
  const isEditor = hasRole('editor')
  const isUser = hasRole('user')

  // If specific roles were passed in, check if user has any of them
  const hasRequiredRole = roles ? hasAnyRole(roles) : true

  return {
    user,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isEditor,
    isUser,
    hasRequiredRole,
  }
}
