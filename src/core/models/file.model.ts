export type MthFile = {
  file_id: number
  name: string
  type: string
  item1: string
  item2: string
  item3: string
  year: number
  is_new_upload_type: number
  uploaded_by: number
}

export type FileUploadResult = {
  name: string
  type: string
  key: string
  file: MthFile
}
