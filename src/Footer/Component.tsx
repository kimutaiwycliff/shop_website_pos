import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { FooterClient } from './Component.client'

interface FooterItem {
  link: any
  title?: string
  id?: string
}

interface FooterData {
  navItems?: FooterItem[]
  copyright?: string
}

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterData
  const {
    copyright = `© ${new Date().getFullYear()} Luxe Collections. All rights reserved.`,
    navItems = [],
  } = footerData || {}

  return <FooterClient copyright={copyright} navItems={navItems} />
}
