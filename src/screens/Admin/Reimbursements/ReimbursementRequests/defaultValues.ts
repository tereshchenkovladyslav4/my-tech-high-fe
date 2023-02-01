import { ReimbursementRequestStatus } from '@mth/enums'

export const defaultStatusFilter: ReimbursementRequestStatus[] = [
  ReimbursementRequestStatus.SUBMITTED,
  ReimbursementRequestStatus.RESUBMITTED,
]
