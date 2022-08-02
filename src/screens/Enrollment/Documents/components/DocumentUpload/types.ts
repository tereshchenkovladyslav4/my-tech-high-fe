import { FunctionComponent } from 'react'

type DocumentUploadProps = {
  item: unknown
  formik: unknown
  handleUpload: () => void
  file: File
  firstName: string
  lastName: string
  disabled: boolean
}

export type DocumentUploadTemplateType = FunctionComponent<DocumentUploadProps>
