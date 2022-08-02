import { FunctionComponent } from 'react'
import { S3FileType } from '../DocumentUploadModal/types'

type DocumentsProps = {
  files: Array<File>
}

export type DocumentsTemplateType = FunctionComponent<DocumentsProps>

type DocumentListItemProp = {
  closeAction?: () => void
  file: File | S3FileType
}
export type DocumentListItemTemplateType = FunctionComponent<DocumentListItemProp>
