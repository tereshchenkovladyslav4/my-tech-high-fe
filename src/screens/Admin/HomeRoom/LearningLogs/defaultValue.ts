import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
export const defaultQuestions: RadioGroupOption[] = [
  { option_id: 1, label: 'Subject Checklist', value: true },
  { option_id: 2, label: 'Independent Checklist', value: false },
  { option_id: 3, label: 'Option to Excuse Learning Log', value: false },
]

export const questionCheckboxList: CheckBoxListVM[] = [
  { label: 'Required', value: 'required' },
  { label: 'Add an Upload Option when item is checked', value: 'uploadOption' },
]
