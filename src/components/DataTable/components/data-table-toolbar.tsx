"use client"

import { Table } from "@tanstack/react-table"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"

export interface FilterConfig {
  column: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumns?: string[]
  searchPlaceholder?: string
  filterConfigs?: FilterConfig[]
}

export function DataTableToolbar<TData>({
  table,
  searchColumns = ["title"],
  searchPlaceholder = "Filter items by ...",
  filterConfigs = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const searchValue = currentSearchValue()

  function currentSearchValue() {
    if (searchColumns.length === 1) {
      return (table.getColumn(searchColumns[0])?.getFilterValue() as string) ?? ""
    }
    return (table.getState().globalFilter as string) ?? ""
  }

  const handleSearchChange = (value: string) => {
    // First remove any existing search filters
    table.setColumnFilters(prev =>
      prev.filter(filter => !searchColumns.includes(filter.id))
    )

    if (!value) {
      table.setGlobalFilter(undefined)
      return
    }

    // For multi-column search, we need to implement OR logic
    if (searchColumns.length > 1) {
      table.setGlobalFilter(value)
      table.options.globalFilterFn = (row, columnId, filterValue) => {
        return searchColumns.some(column => {
          const cellValue = row.getValue(column)?.toString().toLowerCase()
          return cellValue?.includes(filterValue.toLowerCase())
        })
      }
    } else {
      // Single column search (simple case)
      table.getColumn(searchColumns[0])?.setFilterValue(value.toLowerCase())
    }
  }

  const clearSearch = () => {
    handleSearchChange("")
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-8 w-[150px] pl-8 lg:w-[250px]"
          />
          {searchValue && (
            <X
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground hover:opacity-75"
              onClick={clearSearch}
            />
          )}
        </div>

        {filterConfigs.map((config) => {
          const column = table.getColumn(config.column)
          return (
            column && (
              <DataTableFacetedFilter
                key={config.column}
                column={column}
                title={config.title}
                options={config.options}
              />
            )
          )
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter(undefined)
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
