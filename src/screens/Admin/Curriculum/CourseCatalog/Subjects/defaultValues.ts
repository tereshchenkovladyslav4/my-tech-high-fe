import { ReduceFunds } from '@mth/enums'
import { Subject, Title } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'

export const defaultSubjectFormData: Subject = {
  subject_id: 0,
  name: '',
  is_active: true,
  priority: 0,
  Periods: [],
  Titles: [],
}
export const defaultTitleFormData: Title = {
  title_id: 0,
  subject_id: 0,
  name: '',
  min_grade: '',
  max_grade: '',
  min_alt_grade: '',
  max_alt_grade: '',
  diploma_seeking_path: undefined,
  reduce_funds: ReduceFunds.NONE,
  price: 0,
  reduce_funds_notification: '',
  custom_built_description: '',
  always_unlock: false,
  custom_built: false,
  third_party_provider: false,
  split_enrollment: false,
  software_reimbursement: false,
  display_notification: false,
  launchpad_course: false,
  subject_notification: '',
  state_course_codes: '',
  course_id: '',
  is_active: true,
}
