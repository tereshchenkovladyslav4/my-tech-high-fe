import { FunctionComponent } from 'react'

type WarningModalProps = {
  title: string
  subtitle: string
  handleModem: () => void
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>

export type UpdateModalProps = {
  visible: boolean
  userID: string | number
  handleModem: () => void
}

export type UpdateModalTemplateType = FunctionComponent<UpdateModalProps>
