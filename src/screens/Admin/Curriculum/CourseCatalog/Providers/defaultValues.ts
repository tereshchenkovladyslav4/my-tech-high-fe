import { ReduceFunds } from '@mth/enums'
import { Course, Provider } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'

export const defaultProviderFormData: Provider = {
  id: 0,
  name: '',
  is_display: false,
  reduce_funds: ReduceFunds.NONE,
  price: 0,
  reduce_funds_notification: '',
  multiple_periods: false,
  multi_periods_notification: '',
  allow_request: false,
  is_active: false,
  Periods: [],
  Courses: [],
}

export const defaultCourseFormData: Course = {
  id: 0,
  provider_id: 0,
  name: '',
  min_grade: '',
  max_grade: '',
  min_alt_grade: '',
  max_alt_grade: '',
  always_unlock: false,
  software_reimbursement: false,
  display_notification: false,
  launchpad_course: false,
  course_id: '',
  course_notification: '',
  reduce_funds_notification: '',
  website: '',
  diploma_seeking_path: undefined,
  limit: null,
  reduce_funds: ReduceFunds.NONE,
  price: 0,
  subject_id: 0,
  Titles: [],
  allow_request: false,
  is_active: true,
  TitleIds: [],
}
