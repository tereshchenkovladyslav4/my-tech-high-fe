import { FunctionComponent } from 'react'
import {
  EnrollmentQuestion,
  EnrollmentQuestionGroup,
} from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

type EnrollmentProps = {
  id: number
}

export type EnrollmentTemplateType = FunctionComponent<EnrollmentProps>

type EnrollmentQuestionProps = {
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
