export type OptionsType = { label: string; value: number; action?: number }

export type ApplicationQuestion = {
  id?: number
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7
  question: string
  options?: OptionsType[]
  required: boolean
  order: number
  response?: string
  region_id?: number
  main_question?: number
  default_question: boolean
  student_question: boolean
  validation: number
  slug: string
  additional_question: string
  active: boolean
}

export type ApplicationQuestionProps = {
  question: ApplicationQuestion
  field: unknown
  meta: unknown
  form: unknown
  handleAddQuestion?: (value: unknown, q: unknown) => void
  emptyDropdownBg?: boolean
}
