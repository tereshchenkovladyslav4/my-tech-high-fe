import { FunctionComponent } from 'react'

type PersonalProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type PersonalTemplateType = FunctionComponent<PersonalProps>
