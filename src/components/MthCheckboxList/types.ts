import { AdditionalQuestionAction } from '@mth/enums'

export type CheckBoxListVM = {
  label: string
  value: string
  action?: AdditionalQuestionAction
  disabled?: boolean
}
