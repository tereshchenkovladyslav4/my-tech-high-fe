import { gql } from '@apollo/client'

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getActiveSchoolYears(region_id: $regionId) {
      date_begin
      date_end
      date_reg_close
      date_reg_open
      grades
      special_ed
      special_ed_options
      birth_date_cut
      school_year_id
      midyear_application
      midyear_application_open
      midyear_application_close
      MainyearApplicatable
      enrollment_packet
      MidyearApplicatable
    }
  }
`

export const getSchoolYearsByRegionId = gql`
  query GetSchoolYearsByRegionId($regionId: ID!) {
    getSchoolYearsByRegionId(region_id: $regionId) {
      date_begin
      date_end
      date_reg_close
      date_reg_open
      grades
      special_ed
      special_ed_options
      birth_date_cut
      school_year_id
      midyear_application
      midyear_application_open
      midyear_application_close
    }
  }
`

export const getSchoolYearQuery = gql`
  query SchoolYears {
    schoolYears {
      school_year_id
      date_begin
      date_end
    }
  }
`
export const GetCurrentSchoolYearByRegionId = gql`
  query Schoolyear_getcurrent($regionId: Int!) {
    schoolyear_getcurrent(region_id: $regionId) {
      schedule
    }
  }
`
