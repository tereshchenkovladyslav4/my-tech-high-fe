import { Order } from '@mth/enums'

export interface HeadCell {
  disablePadding: boolean
  id: keyof number | string
  label: string
  numeric: boolean
  cellSize?: string
}

export interface SortableTableHeaderProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<HTMLSpanElement>, property: string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  noCheckbox?: boolean
  headCells: HeadCell[]
}
