import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'

export type PeriodSelect = {
  PeriodIds: string[]
}

export type RequestUpdatesModalProps = {
  scheduleData: ScheduleData[]
  onSave: (value: number[]) => void
  setShowEditModal: (value: boolean) => void
}

export type RequestUpdatesFormProps = {
  periodsItems: CheckBoxListVM[]
}
