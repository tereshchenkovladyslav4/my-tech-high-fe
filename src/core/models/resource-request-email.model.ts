import { EmailRecord } from './email-record.model'
import { ResourceRequest } from './resource-request.model'

export type ResourceRequestEmail = {
  id: number
  resource_request_id: number
  email_record_id: number
  from_email: string
  subject: string
  body: string
  created_at: string
  ResourceRequest: ResourceRequest
  EmailRecord: EmailRecord
}
