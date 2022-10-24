import { FunctionComponent } from 'react'
import { StandardResponseOption } from './StandardReponses/types'

type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (from: string, subject: string, body: string, options?: StandardResponseOption) => void
  title: string
  options?: StandardResponseOption
  template?: unknown
  editFrom?: boolean
  isNonSelected: boolean
  filters: Array<string>
  handleSchedulesByStatus: (status: string) => void
}

export type EmailModalTemplateType = FunctionComponent<EmailModalProps>
