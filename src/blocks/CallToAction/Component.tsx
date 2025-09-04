import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { CallToActionBlockClient } from './Component.client'

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  links,
  richText,
  blockType = 'cta',
}) => {
  return <CallToActionBlockClient links={links} richText={richText} blockType={blockType} />
}
