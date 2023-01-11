import { SchoolYear } from '@mth/models'
import { FilterVM } from '@mth/screens/Admin/ResourceRequests/Filters/type'

export type ResourceRequestsTableProps = {
  schoolYearId: number
  setSchoolYearId: (value: number) => void

  schoolYear: SchoolYear | undefined
  setSchoolYear: (value: SchoolYear | undefined) => void
  filter: FilterVM | undefined
}

export type ResourceRequestsFileType = {
  Vendor: string
  'Resource ID': string
  'Resource Level ID': string
  'Resource Level': string
  Submitted: string
  Status: string
  'Student ID': string
  'Student First Name': string
  'Student Last Name': string
  'Student Email': string
  Grade: string
  'Student Birthdate': string
  'Parent First Name': string
  'Parent Last Name': string
  'Parent Email': string
  Cost: string
  'Username Generator': string
  'Password Generator': string
  'Returning Status': string
  'School Year': string
  'School Year Status': string
  'Resource Request ID': string
}

export type UpdateResourceRequestVM = {
  id: number
  resource_id: number
  resource_level_id: number
  username: string
  password: string
}
