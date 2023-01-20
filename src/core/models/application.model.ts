import { ApplicationStatus } from '@mth/enums'
import { SchoolYear } from './school-year.model'

export type Application = {
  application_id: number
  student_id: number
  school_year_id: number
  midyear_application: boolean
  date_accepted: Date
  date_started: Date
  date_submitted: Date
  status: ApplicationStatus
  school_year: SchoolYear
}
