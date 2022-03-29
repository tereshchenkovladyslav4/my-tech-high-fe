import { StudentType } from '../../../HomeroomStudentProfile/Student/types'
import { StudentImmunization } from './VaccineView/types'

export type SaveButtonsType = 'Save' | 'Accepted' | 'Missing Info' | 'Age Issue' | 'Conditional'

export interface EnrollmentPacketFormType {
  student: StudentType
  immunizations: StudentImmunization[]
  notes: string
  status: string
  preSaveStatus: string
  packetStatuses: string[]
  missingInfoAlert: boolean
  saveAlert: string
  showSaveWarnModal: boolean
  showMissingInfoModal: boolean
  showAgeIssueModal: boolean
  showValidationErrors: boolean
  age_issue: boolean
  exemptionDate: string
  medicalExempt: boolean
  secondary_contact_first: string
  secondary_contact_last: string
  secondary_phone: string
  secondary_email: string
  date_of_birth: string
  birth_place: string
  birth_country: string
  last_school: string
  last_school_address: string
  last_school_type: number
  household_size: number
  household_income: number
  language: string
  language_home: string
  language_home_child: string
  language_friends: string
  language_home_preferred: string
  hispanic: number
  school_district: string
  race: string
  gender: string
  worked_in_agriculture: number
  military: number
  ferpa_agreement: number
  photo_permission: number
  dir_permission: number
  signature_file_id: number
  missing_files: string
}
