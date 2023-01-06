import { ReactNode } from 'react'

export type WarningModalProps = {
  title: string
  subtitle: string | ReactNode
  btntitle?: string
  handleSubmit: () => void
  showIcon?: boolean
}
