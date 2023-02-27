import { DropDownItem } from '@mth/components/DropDown/types'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { StudentLearningLogStatus } from '../enums/student-learning-log-status.enums'

export type StudentLearningLog = {
  id?: number
  due_date: string
  date_submitted?: string
  name: string
  grade: number
  meta: string
  status: StudentLearningLogStatus | null
  AssignmentId: number
  SchoolYearId: number
  StudentId: number
  created_at: string | Date
  updated_at: string | Date
}

export type LearningLogQuestion = {
  id?: number
  assignment_id?: number
  type: string
  slug?: string
  parent_slug?: string
  question: string
  options?: string
  default_question?: boolean
  validations?: string
  grades?: string
  page: number
  order: number
  can_upload?: boolean
  grade_specific?: boolean

  //temp variables
  required?: boolean
  Options?: (DropDownItem | RadioGroupOption)[]
  Grades?: Array<string | number>
  Validations?: string[]
  answer?: string | number | boolean
  active?: boolean
}
