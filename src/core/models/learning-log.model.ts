import { StudentLearningLogStatus } from '../enums/student-learning-log-status.enums'

export type StudentLearningLog = {
  id?: number
  due_date: string
  date_submitted?: string
  name: string
  grade: number
  status: StudentLearningLogStatus | null
}
