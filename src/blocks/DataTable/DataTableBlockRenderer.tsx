'use client'

import * as React from 'react'
import { buildColumnsFromData, getSearchColumns } from '@/utilities/buildColumnsFromData'
import { DataTable } from '@/components/DataTable/components/data-table'
import { FilterConfig } from '@/components/DataTable/components/data-table-toolbar'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  defaultPageSize?: number
  filterConfigs?: FilterConfig[]
}

export default function DataTableBlockRenderer({ data, defaultPageSize, filterConfigs }: Props) {
  const columns = React.useMemo(() => buildColumnsFromData(data), [data])
  const searchCols = React.useMemo(() => getSearchColumns(columns), [columns])

  return (
    <DataTable
      columns={columns}
      data={data}
      defaultPageSize={defaultPageSize}
      searchColumns={searchCols}
      searchPlaceholder="Search..."
      filterConfigs={filterConfigs}
    />
  )
}
