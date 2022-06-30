import { FunctionComponent } from 'react'
import { StandardResponseOption } from './StandardReponses/types'

type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (from: string, subject: string, body: string, options?: StandardResponseOption) => void
  title: string
  options?: StandardResponseOption
  template?: any
  editFrom?: boolean
}

export type EmailModalTemplateType = FunctionComponent<EmailModalProps>
