import { FunctionComponent } from 'react'

export type AddedProps = {
  handleModem: (type: string) => void
}

export type AddedModalTemplateType = FunctionComponent<AddedProps>
