export type Classes = {
  class_id: number
  class_name: string
  primaryTeacher?: {
    firstName?: string
    lastName?: string
    user_id?: number
  }
  students?: number
  ungraded?: string
  addition_id?: string
}

export type Master = {
  master_id: number
  master_name?: string
  classesCount?: number
  masterClasses?: Classes[] | undefined
  school_year_id?: number
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
