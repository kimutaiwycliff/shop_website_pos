import { cn } from '@/utilities/ui'
import React from 'react'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { ContentBlockClient } from '@/blocks/Content/Component.client'

export const ContentBlock: React.FC<ContentBlockProps> = ({ blockType = 'content', ...props }) => {
  return <ContentBlockClient {...props} blockType={blockType} />
}
