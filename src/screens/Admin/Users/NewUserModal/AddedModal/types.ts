import { FunctionComponent } from 'react'

type AddedProps = {
  handleModem: (type: string) => void
}

export type AddedModalTemplateType = FunctionComponent<AddedProps>
