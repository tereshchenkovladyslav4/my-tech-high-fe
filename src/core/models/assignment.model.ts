import { StudentLearningLog } from './learning-log.model'
import { Master } from './master.model'

export type Assignment = {
  id?: number
  master_id: number
  title: string
  due_date: string | Date
  due_time?: string
  reminder_date: string | Date
  reminder_time?: string
  auto_grade: string | Date
  auto_grade_time?: string
  auto_grade_email: number
  teacher_deadline: string | Date
  teacher_time?: string
  page_count: number
  StudentLearningLogs?: StudentLearningLog[]
  Master?: Master
}
