import {
  EnrollmentQuestion,
  EnrollmentQuestionGroup,
} from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

export type EnrollmentProps = {
  id: number
  disabled: boolean
}

export type EnrollmentQuestionProps = {
  item: EnrollmentQuestion[]
  group: string
  formik: unknown
}

export type GroupProps = {
  group: EnrollmentQuestionGroup
  formik: unknown
}
