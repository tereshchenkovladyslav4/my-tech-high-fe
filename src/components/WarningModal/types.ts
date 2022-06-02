import { FunctionComponent } from 'react'

type WarningModalProps = {
  title: string
  subtitle: string
  handleModem: () => void
  btntitle?: string
  canceltitle?: string
  handleSubmit: () => void
  showIcon?: boolean
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>
