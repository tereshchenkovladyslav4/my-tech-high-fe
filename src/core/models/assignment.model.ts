import { StudentLearningLog } from './learning-log.model'

export type Assignment = {
  id?: number
  master_id: number
  title: string
  due_date: string | Date
  reminder_date: string | Date
  auto_grade: string | Date
  auto_grade_email: number
  teacher_deadline: string | Date
  page_count: number
  StudentLearningLogs: StudentLearningLog[]
}
