import { REIMBURSEMENT_REQUEST_STATUS_ITEMS } from '@mth/constants'
import { ReimbursementRequestStatus } from '@mth/enums'

export const reimbursementRequestStatus = (status: ReimbursementRequestStatus): string => {
  return REIMBURSEMENT_REQUEST_STATUS_ITEMS.find((x) => x.value === status)?.label?.toString() || status.toString()
}
