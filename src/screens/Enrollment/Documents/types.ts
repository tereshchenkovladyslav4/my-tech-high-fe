import { EnrollmentQuestionTab } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

export type PacketDocument = {
  kind: string
  mth_file_id: number
}

export type DocumentsProps = {
  id: number | string
  regionId: number
  questions: EnrollmentQuestionTab
}
