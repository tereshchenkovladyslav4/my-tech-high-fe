import { AdditionalQuestionAction } from '@mth/enums'

export type RadioGroupOption = {
  option_id?: number
  label: string
  value: boolean
  action?: AdditionalQuestionAction | number
  color?: string
}
