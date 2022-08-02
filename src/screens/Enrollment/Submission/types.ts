import { FunctionComponent } from 'react'

type SubmissionProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type SubmissionTemplateType = FunctionComponent<SubmissionProps>
