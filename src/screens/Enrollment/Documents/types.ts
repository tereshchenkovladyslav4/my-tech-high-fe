import { FunctionComponent } from 'react'

type DocumentsProps = {
  id: number | string
  questions: Record<string, unknown>
}

export type DocuementsTemplateType = FunctionComponent<DocumentsProps>
