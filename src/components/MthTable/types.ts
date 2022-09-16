import { ReactNode } from 'react'
import { MthColor } from '@mth/enums'

export type MthTableField<T> = {
  key: string
  label?: string
  sortable?: boolean
  formatter?: (item: MthTableRowItem<T>) => string | number | ReactNode
  tdClass?: string
}

export type MthTableRowItem<T> = {
  columns: Record<string | number, string | number | ReactNode>
  rawData: T
  selectable?: boolean
  isSelected?: boolean
  isExpanded?: boolean
  toggleExpand?: () => void
  expandNode?: string | number | ReactNode
}

export type MthTableProps<T> = {
  fields: MthTableField<T>[]
  items: MthTableRowItem<T>[]
  loading?: boolean
  selectable?: boolean
  size?: 'medium' | 'small'
  checkBoxColor?: MthColor
  oddBg?: boolean
  borderBottom?: boolean
}

export type MthTableRowProps<T> = {
  fields: MthTableField<T>[]
  item: MthTableRowItem<T>
  expanded: boolean
  selectable?: boolean
  size?: 'medium' | 'small'
  checkBoxColor?: MthColor
  handleToggleCheck: (item: MthTableRowItem<T>) => void
}
