import { ReduceFunds } from '@mth/enums'
import { SEMESTER_TYPE } from '@mth/screens/Admin/Curriculum/types'
import { Subject } from '@mth/screens/Homeroom/Schedule/types'

export type Period = {
  id: number
  period: number
  category: string
  min_grade: number | null
  max_grade: number | null
  notify_semester: boolean
  notify_period: boolean
  message_period: string
  message_semester: string
  reduce_funds: ReduceFunds
  price: number | null
  semester: SEMESTER_TYPE
  archived?: boolean
  Subjects?: Subject[]
}
