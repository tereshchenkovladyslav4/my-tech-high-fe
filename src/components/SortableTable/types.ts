import { FunctionComponent } from 'react'
import { HeadCell } from './SortableTableHeader/types'

export type Order = 'asc' | 'desc'

type SortableTableProps = {
  rows?: any
  type?: string
  headCells?: HeadCell[]
  onCheck?: any
  clearAll?: boolean
  updateStatus?: (id: number, status: string) => void
  onRowClick?: any
  onParentClick?: (id: number) => void
  onSortChange?: (property: keyof any, order: string) => void
  toggleMasquerade?: (id: number, masquerade: boolean) => void
  handleMasquerade?: (id: number) => void
  canMasquerade?: boolean
  hideCheck?: boolean
  hover?: boolean
}

export type SortableTableTemplateType = FunctionComponent<SortableTableProps>
