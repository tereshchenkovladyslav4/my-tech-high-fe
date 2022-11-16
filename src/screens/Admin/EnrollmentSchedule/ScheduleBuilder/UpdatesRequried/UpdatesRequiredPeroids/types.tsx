import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'

export type UpdatesRequiredPeriodsProps = {
  scheduleData: ScheduleData[]
  requireUpdatePeriods: string[]
  standardResponseOptions: CheckBoxListVM[]
  setScheduleData: (value: ScheduleData[]) => void
  setRequiredUpdatePeriods: (value: string[]) => void
}
