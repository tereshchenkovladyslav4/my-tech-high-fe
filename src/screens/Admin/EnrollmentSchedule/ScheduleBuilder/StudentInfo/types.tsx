import { DropDownItem } from '@mth/components/DropDown/types'
import { StudentScheduleInfo } from '@mth/screens/Homeroom/Schedule/types'

export type StudentInfoProps = {
  studentInfo: StudentScheduleInfo | undefined
  scheduleStatus: DropDownItem | undefined
  onUpdateScheduleStatus: (str: string) => void
}
