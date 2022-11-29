import { SchedulePeriodHistory } from '@mth/graphql/models/schedule-period'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'

export type ScheduleHistoryProps = {
  studentId: number
  schoolYearId: number
  isSecondSemester: boolean
  refetchSchedule: () => void
}

export type ScheduleHistoryData = {
  scheduleHistoryId: number
  acceptedDate: string
  scheduleData: ScheduleData[]
  schedulePeriodHistory?: SchedulePeriodHistory[]
  isExpand?: boolean
}
