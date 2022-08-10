import { FunctionComponent } from 'react'
import { EmailRecord } from '../type'

type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (template: EmailRecord, body: string) => void
  template?: EmailRecord
}

export type EmailModalTemplateType = FunctionComponent<EmailModalProps>
