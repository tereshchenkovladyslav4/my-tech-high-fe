import { FunctionComponent } from 'react'

type ApplicationModalProps = {
  title?: string
  subtitle?: string
  btntitle?: string
  handleModem: () => void
  handleSubmit: (data: unknown) => void
  data: unknown
  schoolYears?: unknown[]
  handleRefetch: () => void
}

export type ApplicationModalType = FunctionComponent<ApplicationModalProps>

type ApplicationEmailModalProps = {
  handleModem: () => void
  data: unknown[]
  handleSubmit: () => void
}

export type ApplicationEmailModalType = FunctionComponent<ApplicationEmailModalProps>
