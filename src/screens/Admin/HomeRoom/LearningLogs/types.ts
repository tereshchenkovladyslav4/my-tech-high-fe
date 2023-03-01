import { Assignment } from './Master/types'

export type HomeroomStudent = {
  id: number | string
  student_id: number
}

export type Classes = {
  class_id: number
  class_name: string
  PrimaryTeacher?: {
    first_name?: string
    last_name?: string
    user_id?: number
  }
  students?: number
  ungraded?: string
  addition_id?: string
  HomeroomStudents: HomeroomStudent[]
}

export type Master = {
  master_id: number
  master_name?: string
  classesCount?: number
  Classes?: Classes[] | undefined
  school_year_id?: number
  instructions?: string | null
  Assignments?: Assignment[]
}

export type ClassessProps = {
  master: Master
  refetch: () => void
}

export type Teacher = {
  user_id: number
  first_name?: string
  last_name?: string
}

export type LearningLogQuestion = {
  id?: number
  master_id?: number
  type: string
  slug: string
  question: string
  options?: string
  default_question?: boolean
  custom_question?: boolean
  validations?: string[]
  order?: number
  page: number
}
