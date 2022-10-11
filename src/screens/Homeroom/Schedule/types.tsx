import SignatureCanvas from 'react-signature-canvas'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
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
