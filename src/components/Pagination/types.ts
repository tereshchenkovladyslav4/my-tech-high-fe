import { FunctionComponent } from 'react'

type PaginationProps = {
  defaultValue?: unknown
  setParentLimit?: () => void
  handlePageChange: () => void
  numPages: number
  currentPage: number
}

export type PaginationTemplateType = FunctionComponent<PaginationProps>
