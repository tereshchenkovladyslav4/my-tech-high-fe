import { ReactNode } from 'react'

export type SubmissionModal = {
  handleModem: () => void
  document?: 'birth' | 'immunization' | 'residency'
  handleFile: (files: File[]) => void
  limit?: number
  secondaryModal?: boolean
  node?: ReactNode
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

export type DocumentListItemProp = {
  closeAction?: () => void
  file: File | S3FileType
}
