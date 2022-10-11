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
  checkBoxColor?: 'primary' | 'secondary'
  oddBg?: boolean
  borderBottom?: boolean
  isDraggable?: boolean
  onArrange?: (arrangedItems: MthTableRowItem<T>[]) => void
  sx?: SxProps<Theme>
}

export type MthTableRowProps<T> = {
  fields: MthTableField<T>[]
  index: number
  item: MthTableRowItem<T>
  expanded: boolean
  selectable?: boolean
  isDraggable?: boolean
  size?: 'medium' | 'small'
  checkBoxColor?: 'primary' | 'secondary'
  handleToggleCheck: (item: MthTableRowItem<T>) => void
}
