import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { DiplomaSeekingPath, ReduceFunds } from '@mth/enums'
import { ScheduleBuilder, SchoolYearRespnoseType } from '@mth/hooks'
import { Title } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'

export enum EventType {
  ARCHIVE = 'archive',
  UNARCHIVE = 'unarchive',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
}

export type Provider = {
  id: number
  name: string
  is_display: boolean
  reduce_funds: ReduceFunds
  price: number | null
  reduce_funds_notification?: string
  multiple_periods: boolean | undefined
  multi_periods_notification?: string
  allow_request: boolean
  is_active: boolean
  Periods: Period[]
  Courses?: Course[]
  // Temp fields
  PeriodIds: string[]
}

export type Course = {
  id: number
  provider_id: number
  name: string
  min_grade: number | null
  max_grade: number | null
  min_alt_grade: number | null
  max_alt_grade: number | null
  always_unlock: boolean
  software_reimbursement: boolean
  display_notification: false
  course_notification?: string
  launchpad_course: false
  course_id?: string
  website: string
  diploma_seeking_path?: DiplomaSeekingPath
  limit?: number | null
  reduce_funds: ReduceFunds
  price: number | null
  reduce_funds_notification?: string
  subject_id: number
  Titles: Title[]
  allow_request: boolean
  is_active: boolean
  // Temp fields
  TitleIds?: string[]
}

export type Period = {
  id: number
  period: number
  category: string
}

export type CoursesProps = {
  schoolYearId: number
  schoolYearData?: SchoolYearRespnoseType
  provider: Provider
  showArchived: boolean
  refetch: () => void
}

export interface ProviderEditProps {
  schoolYearId: number
  item?: Provider
  refetch: () => void
  setShowEditModal: (value: boolean) => void
}

export type ProviderFormProps = {
  setIsChanged: (value: boolean) => void
  periodsItems: CheckBoxListVM[]
}

export interface CourseEditProps {
  providerId: number
  schoolYearId: number
  schoolYearData?: SchoolYearRespnoseType
  item?: Course
  refetch: () => void
  setShowEditModal: (value: boolean) => void
}

export type CourseFormProps = {
  schoolYearId: number
  schoolYearData?: SchoolYearRespnoseType
  providerItems: DropDownItem[]
  providers: Provider[]
  gradeOptions: DropDownItem[]
  scheduleBuilder?: ScheduleBuilder
}

export interface CourseTitlesProps {
  schoolYearId: number
}

export interface ProviderConfirmModalProps {
  showArchivedModal: boolean
  setShowArchivedModal: (value: boolean) => void
  showUnarchivedModal: boolean
  setShowUnarchivedModal: (value: boolean) => void
  showDeleteModal: boolean
  setShowDeleteModal: (value: boolean) => void
  onConfirm: (eventType: EventType) => void
}

export interface CourseConfirmModalProps {
  showArchivedModal: boolean
  setShowArchivedModal: (value: boolean) => void
  showUnarchivedModal: boolean
  setShowUnarchivedModal: (value: boolean) => void
  showCloneModal: boolean
  setShowCloneModal: (value: boolean) => void
  showDeleteModal: boolean
  setShowDeleteModal: (value: boolean) => void
  onConfirm: (eventType: EventType) => void
}
