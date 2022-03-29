import { FunctionComponent } from 'react'
import { GQLFile, StudentType } from '../../../../HomeroomStudentProfile/Student/types'

export type DocumentType = 'bc' | 'im' | 'ur'
export type DocumentUploadProps = {
  title: string
  subtitle: string,
  document: DocumentType,
  handleUpload: any,
  file?: any,
  disabled?: boolean
}

export type DocumentUploadTemplateType = FunctionComponent<DocumentUploadProps>
