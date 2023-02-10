import { gql } from '@apollo/client'

export const getHomeroomSettingBySchoolYearIdQuery = gql`
  query HomeroomSettingBySchoolYearId($schoolYearId: Float!) {
    homeroomSettingBySchoolYearId(school_year_id: $schoolYearId) {
      id
      max_of_excused_learning_logs_allowed
      notify_when_graded
      notify_when_resubmit_required
      passing_average
      special_education
      update_required_schedule_to_sumbit
      zero_count
      grading_scale_percentage
      grades_by_subject
      gender
      diploma
      days_to_submit_early
      SchoolYearId
    }
  }
`
/*
// Variable Structure //
{
  "schoolYearId": null
}
*/
