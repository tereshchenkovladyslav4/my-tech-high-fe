export const QuestionTypes = [
  {
    value: 1,
    label: 'Drop Down',
  },
  {
    value: 2,
    label: 'Text Field',
  },
  {
    value: 3,
    label: 'Checkbox',
  },
  {
    value: 4,
    label: 'Agreement',
  },
  {
    value: 5,
    label: 'Multiple Choices',
  },
  {
    value: 6,
    label: 'Calendar',
  },
  {
    value: 7,
    label: 'Information',
  },
]

export const ActionQuestionTypes = [
  {
    value: 1,
    label: 'Drop Down',
  },
  {
    value: 3,
    label: 'Checkbox',
  },
  {
    value: 5,
    label: 'Multiple Choices',
  },
]

export type OptionsType = { label: string; value: number | string; action?: 1 | 2 }
// export type LinkType = { description: string, link: string}

export type AdditionalQuestionType = {
  type: 1 | 3 | 5
  question: string
  options: OptionsType[]
  required: boolean
}
export type EnrollmentQuestion = {
  id?: number
  group_id?: number
  type: number
  question: string
  options?: OptionsType[]
  required: boolean
  order: number
  additional_question: string
  validation?: number
  display_admin: boolean
  default_question: boolean
  slug: string
}

export type EnrollmentQuestionGroup = {
  id?: number
  group_name: string
  order: number
  tab_id?: number
  questions: EnrollmentQuestion[]
}

export type EnrollmentQuestionTab = {
  id?: number
  tab_name: string
  is_active: boolean
  groups: EnrollmentQuestionGroup[]
  region_id?: number
}

export const initEnrollmentQuestions: EnrollmentQuestionTab[] = [
  {
    tab_name: 'Contact',
    is_active: true,
    groups: [],
  },
  {
    tab_name: 'Personal',
    is_active: true,
    groups: [],
  },
  {
    tab_name: 'Education',
    is_active: true,
    groups: [],
  },
  {
    tab_name: 'Documents',
    is_active: true,
    groups: [],
  },
  {
    tab_name: 'Submission',
    is_active: true,
    groups: [],
  },
]
