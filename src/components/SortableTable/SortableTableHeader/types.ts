import { FunctionComponent } from 'react'
import { Order } from '../types'

export interface HeadCell {
  disablePadding: boolean
  id: keyof any
  label: string
  numeric: boolean
}

export interface SortableTableHeaderProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof any) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  noCheckbox?: boolean
  headCells: HeadCell[]
}

export type SortableTableHeaders = FunctionComponent<SortableTableHeaderProps>
