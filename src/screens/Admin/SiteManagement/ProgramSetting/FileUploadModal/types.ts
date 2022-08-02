import { FunctionComponent } from 'react'

type SubmissionModal = {
  handleModem: () => void
  document?: 'birth' | 'immunization' | 'residency'
  multi?: boolean
  extensions?: string
  handleFile: () => void
  limit?: number
  invalidMessage?: string
  type?: 'county' | 'schoolDistrict'
}

export type S3FileType = {
  file_id: string
  is_new_upload_type: number
  item1: string
  item2: string
  item3: string
  name: string
  signedUrl: string
  type: string
  year: number
}

export type FileUploadModalTemplateType = FunctionComponent<SubmissionModal>

type FilesProps = {
  files: Array<File>
}

export type FilesTemplateType = FunctionComponent<FilesProps>

type FileListItemProp = {
  closeAction?: () => void
  file: File | S3FileType
}
export type FileListItemTemplateType = FunctionComponent<FileListItemProp>
