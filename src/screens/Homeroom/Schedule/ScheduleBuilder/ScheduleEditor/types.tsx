import { ScheduleStatus } from '@mth/enums'
import { ScheduleData } from '../../types'

export type ScheduleEditorProps = {
  scheduleData: ScheduleData[]
  isAdmin?: boolean
  isEditMode?: boolean
  isSecondSemester?: boolean
  splitEnrollment?: boolean
  parentTooltip?: string
  scheduleStatus: ScheduleStatus
  selectedScheduleStatus?: ScheduleStatus
  isUpdatePeriodRequired?: boolean
  setIsChanged: (value: boolean) => void
  setScheduleData: (value: ScheduleData[]) => void
  handlePeriodUpdateRequired?: (value: string) => void
  handlePeriodUpdateEmail?: (value: string) => void
}
