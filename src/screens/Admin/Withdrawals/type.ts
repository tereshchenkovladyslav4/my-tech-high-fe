export type WithdrawalCount = {
  Notified?: number
  Withdrawn?: number
  Requested?: number
}

export type WithdrawalResponseVM = {
  date: string
  status: string
  date_effective: string
  student_name: string
  grade_level: string
  soe: string
  funding: string
  date_emailed: string
  withdrawal_id: number
}

export type WithdrawalFiltersProps = {
  filters: string[]
  setFilters: (value: string[]) => void
  withdrawCount: WithdrawalCount | undefined
}

export type PageHeaderProps = {
  totalWithdrawals: number
  searchField: string
  setSearchField: (value: string) => void
  onEmailClick: () => void
  onWithdrawClick: () => void
  onReinstateClick: () => void
}

export type PageActionProps = {
  totalWithdrawals: number
  searchField: string
  selectedYear: string | number
  paginationLimit: number
  selectedStatuses: string[]
  setSelectedStatuses: (value: string[]) => void
  setSkip: (value: number) => void
  setPaginationLimit: (value: number) => void
  setSelectedYear: (value: string | number) => void
  onQuickWithdrawalClick: () => void
}
