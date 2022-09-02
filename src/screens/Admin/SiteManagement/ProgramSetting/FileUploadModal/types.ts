import { FunctionComponent } from 'react'

export type SubmissionModal = {
  handleModem: () => void
  document?: 'birth' | 'immunization' | 'residency'
  multi?: boolean
  extensions?: string
  handleFile: (value: File[]) => void
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

type FilesProps = {
  files: Array<File>
}

export type FilesTemplateType = FunctionComponent<FilesProps>

export type FileListItemProps = {
  deleteAction: (value: File | S3FileType) => void
  hasDeleteAction: boolean
  file: File | S3FileType
}
