import { FunctionComponent } from 'react'
import { HeadCell } from './SortableTableHeader/types'

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

type SortableTableProps = {
  rows?: unknown
  type?: string
  headCells: HeadCell[]
  onCheck?: () => void
  clearAll?: boolean
  updateStatus?: (id: number, status: string) => void
  onRowClick?: (_: unknown) => void
  onParentClick?: (id: number) => void
  onSortChange?: (property: keyof unknown, order: string) => void
  toggleMasquerade?: (id: number, masquerade: boolean) => void
  handleMasquerade?: (id: number) => void
  canMasquerade?: boolean
  hideCheck?: boolean
  hover?: boolean
}

export type SortableTableTemplateType = FunctionComponent<SortableTableProps>
