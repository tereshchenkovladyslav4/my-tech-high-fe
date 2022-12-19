import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { ReimbursementFormType } from '../enums/reimbursement-form-type'

export type ReimbursementQuestion = {
  type: QUESTION_TYPE
  priority: number
  question: string
  options: string
  required: boolean
  SchoolYearId: number
  slug: string
  defaultQuestion: boolean
  reimbursement_form_type: ReimbursementFormType
  is_direct_order: boolean
  reimbursement_question_id?: number
  sortable: boolean
}
