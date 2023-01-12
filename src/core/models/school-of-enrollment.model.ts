import { SchoolPartnerType } from '@mth/screens/Admin/SiteManagement/SchoolPartner/types'

export type SchoolOfEnrollmentType = {
  id?: number
  student_id?: number
  school_year_id?: number
  school_partner_id?: number
  partner?: SchoolPartnerType
}
