import { FunctionComponent } from 'react'

type WarningModalProps = {
  title: string
  subtitle: string
  handleModem: () => void
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>

type NewModalProps = {
  visible: boolean
  handleModem: (status?: boolean) => void
  students?: any[]
  data?: any
  ParentEmailValue: string
}

export type NewModalTemplateType = FunctionComponent<NewModalProps>

export interface ApolloError {
  title: string
  severity: string
  flag: boolean
}
