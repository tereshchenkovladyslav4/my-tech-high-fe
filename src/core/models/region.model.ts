import { EmailTemplate } from './email-template.model'
import { SchoolYear } from './school-year.model'

export type RegionDetailProps = RegionType[]

export type RegionType = {
  id: number
  name: string
}
export type Region = {
  // Announcements?: [Announcement]
  // Counties?: County
  // EventTypes?: [EventType]
  // Records?: [StudentRecord]
  // SchoolDistricts?: SchoolDistrict
  SchoolYears?: [SchoolYear]
  application_deadline_num_days?: number
  county_file_name?: string
  county_file_path?: string
  email_templates?: [EmailTemplate]
  enrollment_packet_deadline_num_days?: number
  id?: number
  name?: string
  program?: string
  // region?: UserRegion
  resource_confirm_details?: string
  school_district_file_name?: string
  school_district_file_path?: string
  state_logo?: string
  withdraw_deadline_num_days?: number
}
