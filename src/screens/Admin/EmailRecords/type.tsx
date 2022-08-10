export type EmailRecord = {
  id: string
  created_at: string
  to_email: string
  template_name: string
  subject: string
  from_email: string
  body: string
  status: string
  bcc: string
  region_id: number
}
