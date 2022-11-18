import { gql } from '@apollo/client'

export const getStudentSchedulePeriodsQuery = gql`
  query SchedulePeriods($schoolYearId: Float!, $studentId: Float!) {
    schedulePeriods(schoolYearId: $schoolYearId, studentId: $studentId) {
      CourseId
      PeriodId
      ProviderId
      ScheduleId
      SubjectId
      TitleId
      course_type
      custom_build_description
      osse_coures_name
      osse_district_school
      osse_school_district_name
      schedule_period_id
      tp_addtional_specific_course_website
      tp_course_name
      tp_phone_number
      tp_provider_name
      tp_specific_course_website
      update_required
      Schedule {
        status
        is_second_semester
      }
    }
  }
`

export const getStudentSchedulePeriodHistoriesQuery = gql`
  query SchedulePeriodHistories($schoolYearId: Float!, $studentId: Float!) {
    schedulePeriodHistories(schoolYearId: $schoolYearId, studentId: $studentId) {
      CourseId
      PeriodId
      ProviderId
      ScheduleHistoryId
      SubjectId
      TitleId
      course_type
      custom_build_description
      osse_coures_name
      osse_district_school
      osse_school_district_name
      schedule_period_history_id
      tp_addtional_specific_course_website
      tp_course_name
      tp_phone_number
      tp_provider_name
      tp_specific_course_website
      update_required
      ScheduleHistory {
        schedule_history_id
        date_accepted
      }
    }
  }
`
