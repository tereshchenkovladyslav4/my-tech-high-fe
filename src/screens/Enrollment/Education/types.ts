import { FunctionComponent } from 'react'

export type EducationProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type EducationTemplateType = FunctionComponent<EducationProps>
