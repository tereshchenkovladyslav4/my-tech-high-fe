import { DropDownItem } from '@mth/components/DropDown/types'
import { Address, Email, SchoolYear, SchoolYearType, Student } from '@mth/models'
import { ToDoItem } from '@mth/screens/Dashboard/ToDoList/components/ToDoListItem/types'

export type GQLFile = {
  file_id: string
  kind: string
  mth_file_id: number
  packet_id: number
}

export type Packet = {
  admin_notes: string
  agrees_to_policy: number
  approves_enrollment: number
  birth_country: string
  birth_place: string
  date_accepted: Date
  date_assigned_to_soe: Date
  date_last_submitted: Date
  date_submitted: Date
  deadline: Date
  deleted: number
  dir_permission: number
  exemp_immunization: number
  exemption_form_date: Date
  ferpa_agreement: number
  files: GQLFile[]
  hispanic: number
  household_income: number
  household_size: number
  immunization_notes: string
  language: string
  language_friends: string
  language_home: string
  language_home_child: string
  language_home_preferred: string
  last_school: string
  last_school_address: string
  last_school_type: number
  lives_with: string
  living_location: number
  medical_exemption: number
  military: number
  military_branch: string
  packet_id: number
  permission_to_request_records: number
  photo_permission: number
  race: string
  reenroll_files: string
  reupload_files: string
  school_district: string
  secondary_contact_first: string
  secondary_email: string
  secondary_phone: string
  signature_file_id: number
  signature_name: string
  special_ed: string
  special_ed_desc: string
  status: string
  student: Student
  student_id: number
  understands_special_ed: number
  understands_sped_scheduling: number
  work_move: number
  worked_in_agriculture: number
  secondary_contact_last: string
  is_age_issue?: boolean
  packet_emails: Array<Email>
  missing_files?: string[]
  meta?: string
}

export type Application = {
  application_emails: Array<Email>
  application_id: number
  city_of_residence: string
  date_accepted: Date
  date_started: Date
  date_submitted: Date
  hidden: boolean
  midyear_application: boolean
  referred_by: string
  relation_status: number
  school_year: SchoolYearType
  school_year_id: number
  status: string
  student: Student
  student_id: number
}

export type Status = {
  date_updated: Date
  school_year_id: number
  status: number
  student_id: number
}

export type Parent = {
  parent_id?: number

  person_id?: number

  notes?: string

  person: Person

  students?: Student[]
  phone?: {
    number: string
  }
}
export type Person = {
  email: string
  first_name: string
  gender: string
  last_name: string
  middle_name: null | string
  person_id: string
  preferred_first_name: string
  preferred_last_name: string
  address: Address
  date_of_birth: string
  photo: string
  phone?: {
    number: string
    recieve_text: number
  }
}

export type StudentProps = {
  student: Student
  schoolYears: SchoolYear[]
  showNotification?: ToDoItem | undefined
  withdrawn?: boolean
  schoolYearsDropdown?: DropDownItem[] | []
}
