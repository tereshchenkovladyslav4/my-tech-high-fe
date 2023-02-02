export type PaginationProps = {
  defaultValue?: unknown
  setParentLimit?: (value: number) => void
  handlePageChange: (value: number) => void
  numPages: number
  currentPage: number
}
