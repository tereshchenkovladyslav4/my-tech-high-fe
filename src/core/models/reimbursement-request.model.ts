import { ReimbursementFormType } from '../enums/reimbursement-form-type'
import { ReimbursementRequestStatus } from '../enums/reimbursement-request-status.enum'
import { Student } from './student.model'

export type ReimbursementRequest = {
  id: number
  student_id: number
  status: ReimbursementRequestStatus
  SchoolYearId: number
  Student?: Student
  amount: number
  date_submitted: string
  date_paid: string
  date_ordered: string
  is_direct_order: boolean
  form_type: ReimbursementFormType

  //Temp variable
  periods?: string
  student?: string
}
