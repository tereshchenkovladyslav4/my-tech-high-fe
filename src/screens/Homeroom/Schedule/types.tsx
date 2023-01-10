import SignatureCanvas from 'react-signature-canvas'
import { DropDownItem } from '@mth/components/DropDown/types'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { CourseType, DiplomaSeekingPath, ReduceFunds, SchedulePeriodStatus, ScheduleStatus } from '@mth/enums'
import { Period } from '@mth/models'
import { AssessmentType } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/types'
import { OnSiteSplitEnrollment } from './ScheduleBuilder/OnSiteSplitEnrollmentEdit/types'
import { ThirdPartyProvider } from './ScheduleBuilder/ThirdPartyProviderEdit/types'

export type HeaderComponentProps = {
  title: string
  scheduleStatus?: ScheduleStatus
  isUpdatePeriodRequested?: boolean
  handleBack: () => void
}

export type StudentInfoProps = {
  studentInfo: StudentScheduleInfo | undefined
}

export type StudentScheduleInfo = {
  name: string
  grade: string
  schoolDistrict: string
  specialEd: string
}

export type StudentAssessment = {
  assessmentId: number
  assessmentOptionId?: number | undefined
  optionId: number | undefined
  assessmentOptionOutText: string
}

export type TestingPreferenceProps = {
  studentId: number
  testingPreferenceTitle: string
  testingPreferenceDescription: string
  studentAssessments: StudentAssessment[]
  invalidationTP: number[]
  assessmentItems: AssessmentType[]
  setStudentAssessments: (value: StudentAssessment[]) => void
}

export type OptOutFormProps = {
  studentId: number
  optOutFormTitle: string
  optOutFormDescription: string
  studentAssessments: StudentAssessment[]
  invalidationOF: boolean
  assessmentItems: AssessmentType[]
  signatureName: string
  signatureFileUrl: string
  signatureRef: SignatureCanvas | null
  setSignatureRef: (value: SignatureCanvas | null) => void
  resetSignature: () => void
  setSignatureName: (value: string) => void
  setStudentAssessments: (value: StudentAssessment[]) => void
}

export type ScheduleBuilderProps = {
  studentId: number
  studentName: string
  selectedYear: number | undefined
  showSecondSemester: boolean
  showUnsavedModal: boolean
  splitEnrollment: boolean
  diplomaSeekingPath: DiplomaSeekingPath
  isUpdatePeriodRequested: boolean
  setScheduleStatus: (value: ScheduleStatus) => void
  setIsUpdatePeriodRequested: (value: boolean) => void
  isChanged?: boolean
  setIsChanged: (value: boolean) => void
  onWithoutSaved: (isYes: boolean) => void
}

export type DiplomaSeekingProps = {
  diplomaQuestion: DiplomaQuestionType
  options: RadioGroupOption[]
  setOptions: (value: RadioGroupOption[]) => void
  isError: boolean
}

export type ScheduleProps = {
  studentId: number
}

export type DiplomaQuestionType = {
  title: string
  description: string
}

export type Course = {
  id: number
  provider_id: number
  name: string
  min_alt_grade: number
  max_alt_grade: number
  website: string
  display_notification: boolean
  course_notification: string
  reduce_funds: ReduceFunds
  reduce_funds_notification: string
  Provider: Provider
}

export type Provider = {
  id: number
  name: string
  reduce_funds: ReduceFunds
  reduce_funds_notification: string
  multiple_periods: boolean
  multi_periods_notification: string
  Courses: Course[]
  AltCourses?: Course[]
  Periods: Period[]
}

export type Title = {
  title_id: number
  name: string
  display_notification: boolean
  subject_notification: string
  reduce_funds: ReduceFunds
  reduce_funds_notification: string
  min_alt_grade: number
  max_alt_grade: number
  custom_built: boolean
  custom_built_description: string
  third_party_provider: boolean
  always_unlock: boolean
  CourseTypes: DropDownItem[]
  Providers: Provider[]
  Courses: Course[]
  AltCourses: Course[]
}

export type Subject = {
  subject_id: number
  name: string
  Titles: Title[]
  AltTitles: Title[]
  Providers: Provider[]
}

export type ScheduleData = {
  period: number
  Periods: Period[]
  filteredPeriods: Period[]

  // Selected values
  schedulePeriodId?: number
  schedulePeriodStatus?: SchedulePeriodStatus | null
  Period?: Period
  Subject?: Subject
  Title?: Title
  CourseType?: CourseType
  Provider?: Provider
  Course?: Course
  ThirdParty?: ThirdPartyProvider
  OnSiteSplitEnrollment?: OnSiteSplitEnrollment
  CustomBuiltDescription?: string
  standardResponseOptions?: string

  // Special fields
  FirstSemesterSchedule?: ScheduleData

  // Temp fields
  editable?: boolean
  showButtonName?: SchedulePeriodStatus

  // TODO Should remove below fields
  Type?: string
  Text?: string
  Description?: string
}
