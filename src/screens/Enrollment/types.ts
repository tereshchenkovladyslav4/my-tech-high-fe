import { FunctionComponent } from 'react'
import {
  EnrollmentQuestion,
  EnrollmentQuestionGroup,
} from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

export type EnrollmentProps = {
  id: number
  disabled: boolean
}

export type EnrollmentTemplateType = FunctionComponent<EnrollmentProps>

export type EnrollmentQuestionProps = {
  item: EnrollmentQuestion[]
  group: string
  formik: unknown
}

export type EnrollmentQuestionTemplateType = FunctionComponent<EnrollmentQuestionProps>

type GroupProps = {
  group: EnrollmentQuestionGroup
  formik: unknown
}

export type GroupTemplateType = FunctionComponent<GroupProps>
