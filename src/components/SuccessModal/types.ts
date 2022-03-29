import { FunctionComponent } from 'react'

type WarningModalProps = {
  title: string
  subtitle: string
  btntitle?: string
  handleSubmit: () => void
  showIcon?: boolean
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>
