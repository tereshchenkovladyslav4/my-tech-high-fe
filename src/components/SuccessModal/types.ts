import { FunctionComponent, ReactNode } from 'react'

type WarningModalProps = {
  title: string
  subtitle: string | ReactNode
  btntitle?: string
  handleSubmit: () => void
  showIcon?: boolean
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>
