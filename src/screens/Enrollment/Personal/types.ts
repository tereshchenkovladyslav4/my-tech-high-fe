import { FunctionComponent } from 'react'

export type PersonalProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type PersonalTemplateType = FunctionComponent<PersonalProps>
