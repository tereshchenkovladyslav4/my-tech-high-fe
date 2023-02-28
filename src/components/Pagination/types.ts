export type PaginationProps = {
  testId?: string
  defaultValue?: number
  setParentLimit?: (value: number) => void
  handlePageChange: (value: number) => void
  numPages: number
  currentPage: number
}
