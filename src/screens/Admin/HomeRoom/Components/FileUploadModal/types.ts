export type SubmissionModal = {
  handleFile?: (file: File) => void
  open: boolean
  onClose: () => void
  onDownloadTemplate?: () => void
  isDownloadTemplate?: boolean
  isError?: boolean
  uploadedFileName?: string
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
