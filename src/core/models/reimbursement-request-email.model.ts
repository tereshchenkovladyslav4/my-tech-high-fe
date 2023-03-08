import { EmailRecord } from './email-record.model'
import { ReimbursementRequest } from './reimbursement-request.model'

export type ReimbursementRequestEmail = {
  id: number
  reimbursement_request_id: number
  email_record_id: number
  from_email: string
  subject: string
  body: string
  created_at: string
  ReimbursementRequest: ReimbursementRequest
  EmailRecord: EmailRecord
}
