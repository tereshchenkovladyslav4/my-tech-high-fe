import { FunctionComponent, ReactNode } from 'react'

type TableProps = {
  tableHeaders?: Array<string>
  tableBody: Array<Record<string | number, string | number | ReactNode>>
  isHover?: boolean
}

export type ValueOf<T> = T[keyof T]

export type TableItem<T> = {
  [Properties in keyof T]: T[Properties]
}

export type Field<T> = {
  key: string
  label?: string
  sortable?: boolean
  formatter?: (item: T, idx?: number) => string | number | ReactNode
  tdClass?: string
  thClass?: string
}

export type CustomTableProps<T> = {
  fields: Field<T>[]
  items: T[]
  loading?: boolean
  orderBy?: ValueOf<T>
  order?: 'desc' | 'asc'
  onSort?: (field: string, order: 'asc' | 'desc') => void
  rowGroupBy?: keyof T
  checkable?: boolean
  checked?: ValueOf<T>[]
  checkKey?: keyof T
  handleCheck?: (checked: ValueOf<T>[]) => void
  striped?: boolean
  outlined?: boolean
  borderedLeft?: boolean
  borderedBottom?: boolean
  size?: 'sm' | 'lg'
  error?: string
  isEmptyText?: boolean
}

export type GroupItem<T> = {
  id: ValueOf<T>
  childrenIds: ValueOf<T>[]
  children: T[]
}

export type TableTemplateType = FunctionComponent<TableProps>
