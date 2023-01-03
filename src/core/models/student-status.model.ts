import { StudentStatus } from '@mth/enums'

export type StudentStatusModel = {
  student_id: number
  school_year_id: number
  status: StudentStatus
  date_updated: string
}
