import SignatureCanvas from 'react-signature-canvas'
import { DropDownItem } from '@mth/components/DropDown/types'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { CourseType, ReduceFunds } from '@mth/enums'
import { AssessmentType } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/types'

export type HeaderComponentProps = {
  title: string
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
  selectedYear: number
  isDraftSaved: boolean
  showUnsavedModal: boolean
  setIsChanged: (value: boolean) => void
  onWithoutSaved: (isYes: boolean) => void
  confirmSubmitted: () => void
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
  min_alt_grade: string
  max_alt_grade: string
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
  Courses: Course[]
  AltCourses?: Course[]
}

export type Title = {
  title_id: number
  name: string
  display_notification: boolean
  subject_notification: string
  reduce_funds: ReduceFunds
  reduce_funds_notification: string
  min_alt_grade: string
  max_alt_grade: string
  custom_built: boolean
  custom_built_description: string
  third_party_provider: boolean
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
}

export type Period = {
  id: number
  period: string
  message_period: string
  notify_period: boolean
  category: string
  Subjects: Subject[]
}

export type ScheduleData = {
  period: number
  Periods: Period[]

  // Selected values
  Period?: Period
  Subject?: Subject
  Title?: Title
  CourseType?: CourseType
  Course?: Course
  CustomBuiltDescription?: string

  // TODO Should remove below fields
  Type?: string
  Text?: string
  Description?: string
}
