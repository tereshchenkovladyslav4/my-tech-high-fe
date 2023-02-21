import { DropDownItem } from '@mth/components/DropDown/types'
import { StudentScheduleInfo } from '@mth/screens/Homeroom/Schedule/types'

export type StudentInfoProps = {
  viewonly: boolean
  studentInfo: StudentScheduleInfo | undefined
  scheduleStatus: DropDownItem | undefined
  onUpdateScheduleStatus: (str: string) => void
}
