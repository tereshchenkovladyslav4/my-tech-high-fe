import { SchedulePeriodStatus, ScheduleStatus } from '@mth/enums'
import { ScheduleData } from '../../types'

export type ScheduleEditorProps = {
  scheduleData: ScheduleData[]
  isAdmin?: boolean
  isEditMode?: boolean
  isSecondSemester?: boolean
  hasUnlockedPeriods?: boolean
  splitEnrollment?: boolean
  parentTooltip?: string
  scheduleStatus: ScheduleStatus
  selectedScheduleStatus?: ScheduleStatus
  isUpdatePeriodRequired?: boolean
  isLockedKey?: boolean
  setIsChanged: (value: boolean) => void
  setIsLockedKey?: (value: boolean) => void
  setScheduleData: (value: ScheduleData[]) => void
  handlePeriodUpdateRequired?: (value: string) => void
  handlePeriodUpdateEmail?: (value: string) => void
  handleSchedulePeriodStatusChange?: (value: ScheduleData, status: SchedulePeriodStatus | undefined) => void
}
