import { FunctionComponent } from 'react'

export type EnrollmentModalProps = {
  title?: string
  subtitle?: string
  btntitle?: string
  handleModem: () => void
  handleSubmit: (data: unknown) => void
  data: unknown
  schoolYears?: unknown[]
  handleRefetch: () => void
}

type EnrollmentEmailModalProps = {
  handleModem: () => void
  data: unknown[]
  handleSubmit: () => void
}

export type EnrollmentEmailModalType = FunctionComponent<EnrollmentEmailModalProps>

type EmailModalProps = {
  handleModem: () => void
  handleSubmit: (from: string, subject: string, body: string) => void
  title: string
  editFrom?: boolean
  isNonSelected: boolean
  filters: Array<string>
  handleSchedulesByStatus: (status: string) => void
}

export type EmailModalTemplateType = FunctionComponent<EmailModalProps>
