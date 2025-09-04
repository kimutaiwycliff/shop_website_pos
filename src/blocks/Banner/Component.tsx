import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import React from 'react'
import { BannerBlockClient } from './Component.client'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <BannerBlockClient className={className} content={content} style={style} blockType="banner" />
  )
}
