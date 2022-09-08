import { FunctionComponent, ReactNode } from 'react'

type TableProps = {
  tableHeaders?: Array<string>
  tableBody: Array<Record<string | number, string | number | ReactNode>>
  isHover?: boolean
}

export type Field = {
  key: string
  label?: string
  sortable?: boolean
  formatter?: (value: string | number, item: unknown, idx?: number) => string | number | ReactNode
  tdClass?: string
}

export type CustomTableProps = {
  fields: [Field]
  items: Array<Record<string | number, string | number | ReactNode>>
  loading?: boolean
}

export type TableTemplateType = FunctionComponent<TableProps>
export type CustomTableTemplateType = FunctionComponent<CustomTableProps>
