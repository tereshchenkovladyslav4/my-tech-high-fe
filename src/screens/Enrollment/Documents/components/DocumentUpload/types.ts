import { S3FileType } from '@mth/components/DocumentUploadModal/types'
import { EnrollmentQuestion } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

export type DocumentUploadProps = {
  item: EnrollmentQuestion[]
  formik: unknown
  handleUpload: (documentType: string, files: File[]) => void
  files?: S3FileType[]
  handleDelete?: (file: S3FileType) => void
  fileName: string
  disabled: boolean
}
