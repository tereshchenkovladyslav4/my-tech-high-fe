import { FunctionComponent } from 'react'

export type SubmissionProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type SubmissionTemplateType = FunctionComponent<SubmissionProps>
