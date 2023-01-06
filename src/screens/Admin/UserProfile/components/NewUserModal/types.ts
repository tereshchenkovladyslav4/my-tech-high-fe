import { FunctionComponent } from 'react'

type WarningModalProps = {
  title: string
  subtitle: string
  handleModem: () => void
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>

export type NewModalProps = {
  visible: boolean
  handleModem: (status?: boolean) => void
  students?: unknown[]
  data?: unknown
  ParentEmailValue: string
}

export type NewModalTemplateType = FunctionComponent<NewModalProps>

export interface ApolloError {
  title: string
  severity: string
  flag: boolean
}
