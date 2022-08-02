import { FunctionComponent } from 'react'

type EducationProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type EducationTemplateType = FunctionComponent<EducationProps>
