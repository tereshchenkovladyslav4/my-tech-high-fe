export type Teacher = {
  id: number
  due_date: string
  title: string
  reminder: string
  auto_grade: string
  teacher_deadline: string
}

export type Assignment = {
  auto_grade_email: number
  id?: number
  master_id: number
  title: string
  page_count: number
  dueDate: string | Date
  dueTime: string
  reminderDate: string | Date
  reminderTime: string
  autoGradeDate: string | Date
  autoGradeTime: string
  teacherDate: string | Date
  teacherTime: string
  due_date: string | Date
}

export type QuestionOptionType = {
  value?: string | number
  label?: string
  action?: number
}

export type AssignmentQuestionType = {
  id: number | undefined
  type: string
  question: string
  options?: QuestionOptionType[]
  validations: string[]
  grades?: Array<string | number>
  slug: string
  parent_slug: string
  active: boolean
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
  page: number
  validations: string[]

  active?: boolean

  response?: string
}
