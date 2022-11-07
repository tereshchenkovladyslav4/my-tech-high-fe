import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'

export type UpdateRequiredPeriodsProps = {
  scheduleData: ScheduleData[]
  requireUpdatePeriods: string[]
  setRequiredUpdatePeriods: (value: string[]) => void
}
