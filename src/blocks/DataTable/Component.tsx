import type { DataTableBlock as DataTableBlockProps } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import dynamic from 'next/dynamic'
import { FilterConfig } from '@/components/DataTable/components/data-table-toolbar'

const DataTableBlockRenderer = dynamic(() => import('./DataTableBlockRenderer'), {
  ssr: true,
})

export const DataTableBlock: React.FC<DataTableBlockProps> = async ({
  targetCollection,
  defaultPageSize,
  filters,
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

  // Transform filters to match FilterConfig type
  const transformedFilters: FilterConfig[] = (filters || []).map((filter) => ({
    column: filter.column,
    title: filter.title,
    options: (filter.options || []).map((option) => ({
      label: option.label,
      value: option.value,
      // icon is optional and not provided from payload, so we omit it
    })),
  }))

  return (
    <DataTableBlockRenderer
      data={result.docs || []}
      defaultPageSize={pageSize}
      filterConfigs={transformedFilters}
    />
  )
}
