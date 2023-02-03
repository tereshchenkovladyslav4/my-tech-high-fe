import { HeadCell } from './SortableTableHeader/types'

export type SortableTableProps = {
  rows?: unknown
  type?: string
  headCells: HeadCell[]
  onCheck?: (value: string[]) => void
  clearAll?: boolean
  updateStatus?: (id: number, status: string) => void
  onRowClick?: (_: unknown) => void
  onParentClick?: (id: number) => void
  onSortChange?: (property: string, order: string) => void
  toggleMasquerade?: (id: number, masquerade: boolean) => void
  handleMasquerade?: (id: number) => void
  canMasquerade?: boolean
  hideCheck?: boolean
  hover?: boolean
}
