import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CartProvider } from './CartContext'
import { Toaster } from '@/components/ui/sonner'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Toaster richColors={false} />
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
