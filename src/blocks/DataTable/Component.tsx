import type { DataTableBlock as DataTableBlockProps } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import dynamic from 'next/dynamic'

const DataTableBlockRenderer = dynamic(() => import('./DataTableBlockRenderer'), {
  ssr: true,
})

export const DataTableBlock: React.FC<DataTableBlockProps> = async ({
  targetCollection,
  defaultPageSize,
  filters
}) => {
  const payload = await getPayload({ config: configPromise })
  const pageSize = defaultPageSize || 10
  const maxPages = 5
  const result = await payload.find({
    collection: targetCollection,
    limit: pageSize * maxPages,
    pagination: false,
    overrideAccess: false,
  })

  return (
      <DataTableBlockRenderer
        data={result.docs || []}
        defaultPageSize={pageSize}
        filterConfigs={filters ?? []}
      />
    
  )
}
