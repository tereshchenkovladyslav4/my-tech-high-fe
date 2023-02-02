import { EmailRecord } from '../type'

export type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (template: EmailRecord, body: string) => void
  template?: EmailRecord
}
