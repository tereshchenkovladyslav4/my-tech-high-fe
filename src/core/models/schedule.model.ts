import { ScheduleStatus } from '@mth/enums'

export type Schedule = {
  schedule_id: number
  StudentId: number
  SchoolYearId: number
  is_second_semester: boolean
  status: ScheduleStatus
}
