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

export const getReimbursementSchoolYearsByRegionId = gql`
  query ReimbursementRequestSchoolYears($regionId: Int!) {
    reimbursementRequestSchoolYears(regionId: $regionId) {
      school_year_id
      date_begin
      date_end
    }
  }
`

export const getActiveStudentHomeroomSchoolYearsQuery = gql`
  query ActiveHomeroomSchoolYears($studentId: Int!) {
    activeHomeroomSchoolYears(studentId: $studentId) {
      HomeroomSettings {
        SchoolYearId
        days_to_submit_early
        diploma
        gender
        grades_by_subject
        grading_scale_percentage
        id
        max_of_excused_learning_logs_allowed
        notify_when_graded
        notify_when_resubmit_required
        passing_average
        special_education
        update_required_schedule_to_sumbit
        zero_count
      }
      IsCurrentYear
      date_begin
      date_end
      school_year_id
    }
  }
`
