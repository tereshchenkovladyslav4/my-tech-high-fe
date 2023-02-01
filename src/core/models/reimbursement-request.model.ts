import { ReimbursementFormType, ReimbursementRequestStatus } from '@mth/enums'
import { ReimbursementReceipt } from './reimbursement-receipt.model'
import { ReimbursementRequestEmail } from './reimbursement-request-email.model'
import { Student } from './student.model'

export type ReimbursementRequest = {
  reimbursement_request_id: number
  StudentId: number
  status: ReimbursementRequestStatus
  SchoolYearId: number
  Student: Student
  total_amount: number
  date_submitted: string
  date_paid: string
  date_ordered: string
  is_direct_order: boolean
  form_type: ReimbursementFormType
  meta?: string
  signature_file_id: number
  signature_name: string
  periods?: string
  ReimbursementRequestEmails: ReimbursementRequestEmail[]
  ReimbursementReceipts?: ReimbursementReceipt[]
}
