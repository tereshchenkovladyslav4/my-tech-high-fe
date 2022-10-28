import { DropDownItem } from '@mth/components/DropDown/types'

export type FilterVM = {
  grades: string[]
  diplomaSeeking: boolean
  courseType: string[]
  curriculumProviders: string[]
}

export type FiltersProps = {
  filter: FilterVM | undefined
  setFilter: (value: FilterVM | undefined) => void
}

export type ApplicationTableProps = {
  filter: FilterVM | undefined
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
  school_year_id: string
  midyear_application: boolean
  midyear_application_open: string
  midyear_application_close: string
  grades: string
}

export enum COURSE_TYPE {
  MTH = 'MTH Direct',
  THIRD_PARTY = '3rd Party',
  CUSTOM_BUILT = 'Custom-built',
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

export type EnrollmentSchoolTableProps = {
  filter: FilterVM | undefined
  setFilter: (value: FilterVM | undefined) => void
  partnerList: OptionType[]
  schoolYears: DropDownItem[]
  selectedYear?: DropDownItem
  setSelectedYear: (value: DropDownItem) => void
  previousYear?: schoolYearDataType
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
