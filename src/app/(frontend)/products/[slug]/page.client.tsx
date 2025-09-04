'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const PageClient: React.FC = () => {
  // We don't directly use searchParams here to avoid the Suspense requirement
  // Instead, we'll just render the component and let it handle any client-side logic
  
  return null
}

export default PageClient