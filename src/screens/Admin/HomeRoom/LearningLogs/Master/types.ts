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
