import { EmailStatus } from '@mth/enums'

export type EmailRecord = {
  id: number
  from_email: string
  to_email: string
  subject: string
  template_name: string
  region_id: number
  bcc: string
  body: string
  created_at: string
  status: EmailStatus
}
