import { gql } from '@apollo/client'

export const getAssessmentsBySchoolYearId = gql`
  query Query($schoolYearId: ID!) {
    getAssessmentsBySchoolYearId(schoolYearId: $schoolYearId) {
      SchoolYearId
      assessment_id
      grades
      information
      is_archived
      option1
      option_list
      priority
      test_name
    }
  }
`
