import { FunctionComponent } from 'react'
import { StandardResponseOption } from './StandardReponses/types'

type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (subject: string, body: string, options?: StandardResponseOption) => void
  title: string
  options?: StandardResponseOption
  template?: any
}

export type EmailModalTemplateType = FunctionComponent<EmailModalProps>
