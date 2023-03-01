import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
export const defaultQuestions: RadioGroupOption[] = [
  { option_id: 1, label: 'Subject Checklist', value: true },
  { option_id: 2, label: 'Independent Checklist', value: false },
  { option_id: 3, label: 'Option to Excuse a Learning Log', value: false },
]

export const questionCheckboxList: CheckBoxListVM[] = [
  { label: 'Required', value: 'required' },
  { label: 'Add an Upload Option when item is checked', value: 'uploadOption' },
]

export const defaultIndependentQuestion: CheckBoxListVM[] = [
  { label: 'Depth of knowledge across multiple subject areas', value: 'checkbox1' },
  { label: 'Physical, social, mental, and emotional well-being', value: 'checkbox2' },
  { label: 'Civic responsibility, integrity, and community service', value: 'checkbox3' },
  { label: 'Practical, age-appropriate financial skills', value: 'checkbox4' },
]
