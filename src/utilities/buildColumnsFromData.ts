// lib/buildColumnsFromData.ts
import { ColumnDef } from '@tanstack/react-table'

export function buildColumnsFromData<T extends object>(data: T[]): ColumnDef<T>[] {
  if (!data.length) return []

  const hiddenFields = ['_id', 'createdAt', 'updatedAt', '__v', 'parent', 'breadcrumbs']

  const firstRow = data[0]
  return Object.keys(firstRow)
    .filter((key) => !hiddenFields.includes(key))
    .map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => {
        const value = info.getValue()
        if (typeof value === 'object' && value !== null) return JSON.stringify(value)
        return String(value)
      },
    }))
}

export function getSearchColumns<T>(columns: ColumnDef<T>[]): string[] {
  return columns
    .filter((col): col is { accessorKey: string } => 'accessorKey' in col)
    .map(col => col.accessorKey)
}
