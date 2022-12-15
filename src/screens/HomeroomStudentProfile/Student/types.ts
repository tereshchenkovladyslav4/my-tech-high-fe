import { FunctionComponent } from 'react'
import { DropDownItem } from '@mth/components/DropDown/types'
import { ScheduleStatus } from '@mth/enums'
import { Email, SchoolYear, SchoolYearType } from '@mth/models'
import { ToDoItem } from '@mth/screens/Dashboard/ToDoList/components/ToDoListItem/types'

export type GradeLevel = {
  school_year_id: number | string
  grade_level: number | string
}

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
  student: StudentType
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
  student: StudentType
  student_id: number
}

export type Schedule = {
  schedule_id: number
  StudentId: number
  SchoolYearId: number
  is_second_semester: boolean
  status: ScheduleStatus
}

export type StudentType = {
  grade_levels: GradeLevel[]
  person: Person
  student_id: number
  parent_id: number
  person_id: number
  reenrolled: number
  packets?: Packet[]
  applications?: Application[]
  parent?: Parent
  hidden?: number
  grade_level?: string
  current_school_year_status: {
    application_id: number
    school_year_id: number
    grade_level: string
    special_ed_options?: string
    midyear_application?: string
    midyear_schedule_open?: string
    midyear_schedule_close?: string
    schedule_builder_open?: string
    schedule_builder_close?: string
    application_date_submitted?: string
    second_semester_close?: string
    second_semester_open?: string
    withdraw_deadline_num_days?: number
    enrollment_packet_date_deadline?: string
    application_date_accepted?: string
  }
  StudentSchedules?: Schedule[]
  StudentWithdrawals?: {
    date?: string
    date_emailed: string
  }[]
  status: Status[]
  reenrollment_status: ReenrollmentStatus[]
  testing_preference: string
  special_ed?: number
  diploma_seeking?: number
}

export type ReenrollmentStatus = {
  student_id: number
  reenrolled: number
  school_year_id: number
}

export type Status = {
  date_updated: Date
  school_year_id: number
  status: number
  student_id: number
}

export type Address = {
  city: string
  street: string
  street2: string
  zip: string
  state: string
  county_id: number
}
export type Parent = {
  parent_id?: number

  person_id?: number

  notes?: string

  person: Person

  students?: StudentType[]
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
  student: StudentType
  schoolYears: SchoolYear[]
  showNotification?: ToDoItem | undefined
  withdrawn?: boolean
  schoolYearsDropdown?: DropDownItem[] | []
}
export type StudentComponentType = FunctionComponent<StudentProps>
