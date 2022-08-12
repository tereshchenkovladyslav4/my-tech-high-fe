import { FunctionComponent } from 'react'

type PaginationProps = {
  defaultValue?: unknown
  setParentLimit?: (value: number) => void
  handlePageChange: (value: number) => void
  numPages: number
  currentPage: number
}

export type PaginationTemplateType = FunctionComponent<PaginationProps>
