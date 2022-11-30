import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { DiplomaSeekingPath, ReduceFunds } from '@mth/enums'
import { ScheduleBuilder } from '@mth/hooks'
import { SchoolYear } from '@mth/models'

export enum EventType {
  ARCHIVE = 'archive',
  UNARCHIVE = 'unarchive',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
}

export type Subject = {
  subject_id: number
  name: string
  allow_request: boolean
  is_active: boolean
  priority: number
  Periods: Period[]
  Titles?: Title[]
  // Temp fields
  PeriodIds?: string[]
}

export type Period = {
  id: number
  period: number
  category: string
}

export type StateCourseCord = {
  gradeIndex: number
  stateCode: string
  teacher: string
}

export type Title = {
  title_id: number
  subject_id: number
  name: string
  min_grade: number | null
  max_grade: number | null
  min_alt_grade: number | null
  max_alt_grade: number | null
  diploma_seeking_path?: DiplomaSeekingPath
  reduce_funds: ReduceFunds
  price: number | null
  always_unlock: boolean
  custom_built: boolean
  third_party_provider: boolean
  split_enrollment: boolean
  software_reimbursement: boolean
  display_notification: boolean
  launchpad_course: boolean
  course_id?: string
  reduce_funds_notification?: string
  custom_built_description?: string
  subject_notification?: string
  state_course_codes: string
  allow_request: boolean
  is_active: boolean

  //  Temp fields
  diploma_seeking?: boolean
  stateCourseCords?: StateCourseCord[]
}

export type TitlesProps = {
  schoolYearId: number
  schoolYearData?: SchoolYear
  subject: Subject
  showArchived: boolean
  refetch: () => void
}

export interface SubjectEditProps {
  schoolYearId: number
  item?: Subject
  refetch: () => void
  setShowEditModal: (value: boolean) => void
}

export type SubjectFormProps = {
  setIsChanged: (value: boolean) => void
  periodsItems: CheckBoxListVM[]
}

export interface TitleEditProps {
  subjectId: number
  schoolYearId: number
  schoolYearData?: SchoolYear
  item?: Title
  refetch: () => void
  setShowEditModal: (value: boolean) => void
}

export type TitleFormProps = {
  schoolYearData?: SchoolYear
  subjectsItems: DropDownItem[]
  gradeOptions: DropDownItem[]
  scheduleBuilder?: ScheduleBuilder
}

export interface SubjectConfirmModalProps {
  showArchivedModal: boolean
  setShowArchivedModal: (value: boolean) => void
  showUnarchivedModal: boolean
  setShowUnarchivedModal: (value: boolean) => void
  showDeleteModal: boolean
  setShowDeleteModal: (value: boolean) => void
  handleChangeSubjectStatus: (eventType: EventType) => void
}

export interface TitleConfirmModalProps {
  showArchivedModal: boolean
  setShowArchivedModal: (value: boolean) => void
  showUnarchivedModal: boolean
  setShowUnarchivedModal: (value: boolean) => void
  showCloneModal: boolean
  setShowCloneModal: (value: boolean) => void
  showDeleteModal: boolean
  setShowDeleteModal: (value: boolean) => void
  handleChangeTitleStatus: (eventType: EventType) => void
}
