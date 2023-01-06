import { DropDownItem } from '@mth/components/DropDown/types'
import { QUESTION_TYPE } from '../enums/question-type.enum'
import { ReimbursementFormType } from '../enums/reimbursement-form-type'

export type ReimbursementQuestion = {
  type: QUESTION_TYPE
  priority: number
  question: string
  options: string
  required: boolean
  SchoolYearId: number
  slug: string
  default_question: boolean
  reimbursement_form_type: ReimbursementFormType
  is_direct_order: boolean
  reimbursement_question_id?: number
  sortable: boolean
  display_for_admin?: boolean
  additional_question?: string

  // Temp Items
  Options?: DropDownItem[]
  SettingList?: string[]
}
