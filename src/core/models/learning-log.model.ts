import { StudentLearningLogStatus } from '../enums/student-learning-log-status.enums'

export type StudentLearningLog = {
  id?: number
  due_date: string
  date_submitted?: string
  name: string
  grade: number
  meta: string
  status: StudentLearningLogStatus | null
  AssignmentId: number
  SchoolYearId: number
  StudentId: number
  created_at: string | Date
  updated_at: string | Date
}
