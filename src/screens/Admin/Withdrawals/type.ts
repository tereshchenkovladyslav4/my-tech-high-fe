import { EmailTemplateResponseVM } from '@mth/graphql/models/email-template'
import { EmailTemplate, Withdrawal } from '@mth/models'

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
  StudentId: number
}

export type WithdrawalEmailResponseVM = {
  subject: string
  body: string
  from_email: string
  created_at: string
}

export type StudentInfo = {
  withdrawalId: number
  grade: string
  studentId: number
  parentId: number
  firstName: string
  lastName: string
  schoolOfEnrollment: string
}

export type PageModalsProps = {
  showWithdrawalConfirmModal: boolean
  showReinstateModal: boolean
  reinstateModalType: number
  openWarningModal: boolean
  errorReinstateModal: boolean
  openEmailModal: boolean
  checkedWithdrawalIds: Array<string>
  emailTemplate: EmailTemplateResponseVM | EmailTemplate | undefined
  openEmailHistoryModal: boolean
  withdrawalId: number
  effective: EffectiveVM
  openEffectiveCalendar: boolean
  isShowWithdrawalModal: boolean
  selectedWithdrawal: WithdrawalResponseVM | undefined
  showWithdrawModal: boolean
  withdrawals: Withdrawal[]
  setIsShowWithdrawalModal: (value: boolean) => void
  setShowReinstateModal: (value: boolean) => void
  setShowWithdrawalConfirmModal: (value: boolean) => void
  setShowWithdrawModal: (value: boolean) => void
  setOpenWarningModal: (value: boolean) => void
  setErrorReinstateModal: (value: boolean) => void
  setOpenEmailModal: (value: boolean) => void
  setOpenEmailHistoryModal: (value: boolean) => void
  setEffective: (value: EffectiveVM) => void
  setOpenEffectiveCalendar: (value: boolean) => void
  refetch: () => void
  refetchWithdrawalsCount: () => void
  refetchEmailTemplate: () => void
}

export type WithdrawalPageProps = {
  searchField: string
  selectedYear: number
  withdrawalCounts: WithdrawalCount
  emailTemplate: EmailTemplateResponseVM | undefined
  setSearchField: (value: string) => void
  setWithdrawalCounts: (value: WithdrawalCount) => void
  setSelectedYear: (value: number) => void
  refetchWithdrawalsCount: () => void
  refetchEmailTemplate: () => void
  setEmailMidTemplate: (val: boolean) => void
}

export type EffectiveVM = {
  date: string
  withdrawId: number
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
  selectedYear: number
  paginationLimit: number
  selectedStatuses: string[]
  withdrawalCounts: WithdrawalCount
  setWithdrawalCounts: (value: WithdrawalCount) => void
  setSelectedStatuses: (value: string[]) => void
  setSkip: (value: number) => void
  setPaginationLimit: (value: number) => void
  setSelectedYear: (value: number) => void
  onQuickWithdrawalClick: () => void
}
