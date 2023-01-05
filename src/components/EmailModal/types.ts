import { FunctionComponent } from 'react'
import { EmailTemplate } from '@mth/models'
import { StandardResponseOption } from './StandardReponses/types'

export type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (from: string, subject: string, body: string, options?: StandardResponseOption) => void
  title: string
  options?: StandardResponseOption
  template?: EmailTemplate
  editFrom?: boolean
  isNonSelected: boolean
  filters: Array<string>
  inserts?: string[]
  insertDescriptions?: { [key: string]: string }
  handleSchedulesByStatus: (status: string) => void
}

export type EmailModalTemplateType = FunctionComponent<EmailModalProps>
