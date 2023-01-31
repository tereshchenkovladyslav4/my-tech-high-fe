import { ReimbursementFormType } from '../enums/reimbursement-form-type'
import { ReimbursementRequestStatus } from '../enums/reimbursement-request-status.enum'
import { ReimbursementReceipt } from './reimbursement-receipt.model'
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
  ReimbursementReceipts?: ReimbursementReceipt[]
}
