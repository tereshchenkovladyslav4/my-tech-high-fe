import { ReactNode } from 'react'
import { SxProps, Theme } from '@mui/material/styles'
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'

export type MthTableField<T> = {
  key: string
  label?: string
  sortable?: boolean
  formatter?: (
    item: MthTableRowItem<T>,
    dragHandleProps?: DraggableProvidedDragHandleProps,
  ) => string | number | ReactNode
  tdClass?: string
  width?: string | number
}

export type MthTableRowItem<T> = {
  /**
   * Unique key should be provided.
   */
  key: string
  columns: Record<string | number, string | number | ReactNode>
  rawData: T
  selectable?: boolean
  isSelected?: boolean
  toggleExpand?: () => void
  expandNode?: string | number | ReactNode
  sx?: SxProps<Theme>
}

export type MthTableProps<T> = {
  fields: MthTableField<T>[]
  items: MthTableRowItem<T>[]
  loading?: boolean
  selectable?: boolean
  showSelectAll?: boolean
  disableSelectAll?: boolean
  size?: 'medium' | 'small'
  checkBoxColor?: 'primary' | 'secondary'
  oddBg?: boolean
  borderBottom?: boolean
  isDraggable?: boolean
  onArrange?: (arrangedItems: MthTableRowItem<T>[]) => void
  onSelectionChange?: (arrangedItems: MthTableRowItem<T>[], isAll: boolean) => void
  sx?: SxProps<Theme>
}

export type MthTableRowProps<T> = {
  tableWidth: number
  fields: MthTableField<T>[]
  index: number
  item: MthTableRowItem<T>
  selectable?: boolean
  isDraggable?: boolean
  size?: 'medium' | 'small'
  checkBoxColor?: 'primary' | 'secondary'
  handleToggleCheck: (item: MthTableRowItem<T>) => void
}
