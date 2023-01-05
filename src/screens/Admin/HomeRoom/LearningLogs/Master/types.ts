export type Teacher = {
  id: number
  due_date: string
  title: string
  reminder: string
  auto_grade: string
  teacher_deadline: string
}

export type Assignment = {
  auto_grade: string
  auto_grade_email: number
  due_date: string
  id: number
  master_id: number
  reminder_date: string
  title: string
  teacher_deadline: string
}

export type QuestionOptionType = {
  value: string | number
  label: string
  action: number
}

export type AssignmentQuestionType = {
  id: number | undefined
  type: string
  question: string
  options?: QuestionOptionType[]
  validations: string[]
  grades?: Array<string | number>
  slug: string
  parentSlug: string
}

export type LearningQuestionType = {
  assignment_id: number
  question: string
  type: string
  slug?: string
  parent_slug?: string
  options?: string
  default_question?: boolean
  grade_specific?: boolean
  required?: boolean
  can_upload?: boolean
  grades?: string

  response?: string
}
