import { DropDownItem } from '../SiteManagement/components/DropDown/types'

export enum YEAR_STATUS {
  NEW = 'NEW',
  RETURNING = 'RETURNING',
  TRANSFERRED = 'TRANSFERRED',
  SIBLING = 'SIBLING',
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

export type PartnerItem = {
  value: string
  label: string
  abb: string
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
  partnerList: PartnerItem[]
  previousPartnerList: PartnerItem[]
  selectedYear?: DropDownItem
  gradesList: string[]
}

export type EnrollmentSchoolTableProps = {
  filter: FilterVM | undefined
  setFilter: (value: FilterVM | undefined) => void
  partnerList: PartnerItem[]
  schoolYears: DropDownItem[]
  selectedYear?: DropDownItem
  setSelectedYear: (value: DropDownItem) => void
  previousYear?: schoolYearDataType
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
  name: string
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

export type StudentVM = {
  currentSoe: Person[]
  grade_levels: GradeLevel[]
  parent: Parent
  person: Person
  previousSoe: Person[]
  student_id: string | number
}

export type SchoolDistrictType = {
  id: string
  school_district_name: string
}
