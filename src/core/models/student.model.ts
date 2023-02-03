import { Application } from './application.model'
import { CurrentSchoolYearStatus } from './current-school-year-status.model'
import { Packet } from './packet.model'
import { Parent } from './parent.model'
import { Person } from './person.model'
import { ReenrollmentStatus } from './re-enrollment-status.model'
import { Schedule } from './schedule.model'
import { SchoolOfEnrollmentType } from './school-of-enrollment.model'
import { StudentGradeLevel } from './student-grade-level.model'
import { StudentStatusModel } from './student-status.model'
import { Withdrawal } from './withdrawal.model'

export type Student = {
  student_id: number
  parent_id: number
  person_id: number
  reenrolled: number
  testing_preference: string
  special_ed?: number
  diploma_seeking?: number
  hidden?: number
  grade_level?: string
  username_first_last: string
  username_last_first: string
  username_last_first_year: string
  username_last_firstinitial: string
  username_last_first_mth: string
  username_last_first_birth: string
  username_first_last_domain: string
  username_student_email: string
  username_parent_email: string
  person: Person
  parent: Parent
  status: StudentStatusModel[]
  grade_levels: StudentGradeLevel[]
  applications?: Application[]
  current_school_year_status: CurrentSchoolYearStatus
  currentSoe: SchoolOfEnrollmentType[]
  packets?: Packet[]
  StudentSchedules?: Schedule[]
  StudentWithdrawals?: Withdrawal[]
  reenrollment_status: ReenrollmentStatus[]
}
