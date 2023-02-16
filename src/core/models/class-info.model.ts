export type ClassInfo = {
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
}
