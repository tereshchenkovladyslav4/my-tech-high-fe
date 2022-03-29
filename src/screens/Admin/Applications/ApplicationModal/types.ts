import { FunctionComponent } from 'react'

type ApplicationModalProps = {
  title?: string
  subtitle?: string
  btntitle?: string
  handleModem: () => void
  handleSubmit: (data: any) => void
  data: any
  schoolYears?: any[]
  handleRefetch: () => void
}

export type ApplicationModalType = FunctionComponent<ApplicationModalProps>

type ApplicationEmailModalProps = {
  handleModem: () => void
  data: any[]
  handleSubmit: () => void
}

export type ApplicationEmailModalType = FunctionComponent<ApplicationEmailModalProps>
