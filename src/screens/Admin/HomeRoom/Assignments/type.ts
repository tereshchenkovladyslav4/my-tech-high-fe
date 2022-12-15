import { DropDownItem } from '@mth/components/DropDown/types'
import { Classes } from '../LearningLogs/types'

export enum YEAR_STATUS {
  NEW = 'NEW',
  RETURNING = 'RETURNING',
  FAMILIES = 'Families',
}

export type FilterVM = {
  grades?: string[]
  accountStatus?: string[]
  status?: string[]
  specialEd?: string[]
  // schoolYear: number
  visibility?: string[]
  schoolYearId?: string
  schoolOfEnrollments?: string[]
  previousSOE?: string[]
  schoolDistrict?: string[]
  yearStatus?: YEAR_STATUS[]
}

export type SchoolPartner = {
  value: string
  label: string
  abb: string
}

export type OptionType = {
  value: number | string
  label: string
}

export type PartnerEnrollmentType = {
  school_partner_id: string
  name: string
  abbreviation: string
  active: number
}

export type schoolYearDataType = {
  date_begin: string
  date_end: string
  school_year_id: string
  midyear_application: number
  midyear_application_open: string
  midyear_application_close: string
  grades: string
}

export type FiltersProps = {
  filter: FilterVM | undefined
  setFilter: (value: FilterVM | undefined) => void
  partnerList: OptionType[]
  previousPartnerList: SchoolPartner[]
  selectedYear?: DropDownItem
  gradesList: string[]

  specEd: string[]
  currentHomeroomes: OptionType[]
  prevHomeroomes: OptionType[]
  providers: OptionType[]
  previousYear: {
    date_begin: string
    date_end: string
    school_year_id: string
    midyear_application: number
    midyear_application_open: string
    midyear_application_close: string
    special_ed_options: string
    grades: string
  }
}

export type EnrollmentSchoolTableProps = {
  filter: FilterVM | undefined
  setFilter: (value: FilterVM | undefined) => void
  partnerList: OptionType[]
  schoolYears: DropDownItem[]
  selectedYear?: DropDownItem
  setSelectedYear: (value: DropDownItem) => void
  previousYear?: schoolYearDataType
  currentHomeroomes: OptionType[]
}

export type EmailTemplateVM = {
  bcc: string
  body: string
  from: string
  id: string
  standard_responses: string
  subject: string
  template_name: string
  title: string
}

export type SchoolYearVM = {
  date_begin: string
  date_end: string
  school_year_id: number
  midyear_application: boolean
  midyear_application_open: string
  midyear_application_close: string
  date_reg_open: string
  date_reg_close: string
}

export type GradeLevel = {
  grade_level?: string
  school_year_id: string | number
}

export type Address = {
  city?: string
}

export type Partner = {
  name?: string
  abbreviation?: string
}

export type Person = {
  first_name?: string
  last_name?: string
  name: string
  address: Address
  partner?: Partner
}

export type Parent = {
  person?: Person
}

export type HomeroomStudent = {
  id: number
  teacher: Classes
}

export type StudentVM = {
  grade_levels: GradeLevel[]
  parent: Parent
  person: Person
  student_id: string | number
  currentHomeroom?: HomeroomStudent
  previousHomeroom?: HomeroomStudent
}

export type SchoolDistrictType = {
  id: string
  school_district_name: string
}
