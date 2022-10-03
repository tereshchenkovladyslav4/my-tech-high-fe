import { PropsWithChildren } from 'react'
export type FormDataItemType = {
  key: string
  value: string | File
}

export type FileUploadProp = {
  maxCount?: number
  limitSize?: number
  multiple?: boolean
  formData?: FormDataItemType[]
  accept?: string[] // 'application/pdf' | 'image/png' | 'image/jpeg' | 'image/*'
  onConfirm?: () => void
}

export type FileUploadType = PropsWithChildren<FileUploadProp>

export type FileType = {
  file: File
  onDelete: (file: File) => void
}

export interface RefUploaderHandle {
  uploadPhoto: (additionalFormDataForce?: FormDataItemType[]) => Promise<boolean | string>
}
