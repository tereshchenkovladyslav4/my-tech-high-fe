import { FunctionComponent } from 'react'

type ContactProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type ContactTemplateType = FunctionComponent<ContactProps>
