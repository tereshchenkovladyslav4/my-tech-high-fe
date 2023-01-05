import { FunctionComponent } from 'react'
import { Order } from '@mth/enums'

export interface HeadCell {
  disablePadding: boolean
  id: keyof number | string
  label: string
  numeric: boolean
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

export type SortableTableHeaders = FunctionComponent<SortableTableHeaderProps>
