export type CurriculumItem = {
  id: number
  icon?: string
  title: string
  subtitle: string
  img: string
  link: string
  action?: boolean
  disabled?: boolean
}

export type PeriodItem = {
  id?: number
  category: string
  grade: string
  secondSemester: string
  archived?: boolean
}

export type StateCodeType = {
  id?: number
  title_id: string | number
  title: string
  grade: string
  teacher_id?: number
  teacher_name: string
  state_code: string | number
  subject: string
}
