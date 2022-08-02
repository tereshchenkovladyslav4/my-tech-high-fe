import { ImmunizationsData } from '../../../SiteManagement/EnrollmentSetting/Immunizations/Immunizations'

export interface StudentImmunization {
  student_id?: string
  immunization_id?: string
  value?: string
  updated_by?: number
  date_created?: Date
  date_updated?: Date
  immunization?: ImmunizationsData
}
