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
  formatter?: (value: ValueOf<T>, item: TableItem<T>, idx?: number) => string | number | ReactNode
  tdClass?: string
}

export type CustomTableProps<T> = {
  fields: Field<T>[]
  items: TableItem<T>[]
  loading?: boolean
  orderBy?: ValueOf<T>
  order?: 'desc' | 'asc'
  onSort?: (field: string, order: 'asc' | 'desc') => void
  rowGroupBy?: keyof TableItem<T>
  checkable?: boolean
  checked?: ValueOf<T>[]
  checkKey?: keyof TableItem<T>
  handleCheck?: (checked: ValueOf<T>[]) => void
  striped?: boolean
  outlined?: boolean
  borderedLeft?: boolean
  borderedBottom?: boolean
  size?: 'sm' | 'lg'
}

export type GroupItem<T> = {
  id: ValueOf<T>
  childrenIds: ValueOf<T>[]
  children: TableItem<T>[]
}

export type TableTemplateType = FunctionComponent<TableProps>
