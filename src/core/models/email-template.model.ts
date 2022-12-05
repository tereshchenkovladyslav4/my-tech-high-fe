export type EmailTemplate = {
  id: number
  title: string
  template_name: string
  template: string
  from: string
  body: string
  subject: string
  bcc: string
  category_id: number
  region_id: number
  standard_responses: string[]
  inserts: string[]
  category: EmailCategory
}

export type EmailCategory = {
  category_name: string
}
