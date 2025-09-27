'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Server action to logout user
 */
export async function logout() {
  // Remove the authentication cookie
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  // Redirect to login page
  redirect('/login')
}
