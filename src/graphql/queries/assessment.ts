import { gql } from '@apollo/client'

export const getAssessmentsBySchoolYearId = gql`
  query GetAssessmentsBySchoolYearId($schoolYearId: ID!) {
    getAssessmentsBySchoolYearId(schoolYearId: $schoolYearId) {
      SchoolYearId
      assessment_id
      grades
      information
      is_archived
      priority
      test_name
      Options {
        option_id
        AssessmentId
        label
        method
        require_reason
        reason
      }
      SchoolYear {
        school_year_id
        testing_preference_title
        testing_preference_description
        opt_out_form_title
        opt_out_form_description
        diploma_seeking
        testing_preference
      }
    }
  }
`

export const getStudentAssessmentsByStudentId = gql`
  query GetStudentAssessmentsByStudentId($studentId: ID!) {
    getStudentAssessmentsByStudentId(student_id: $studentId) {
      AssessmentId
      OptionId
      StudentId
      assessment_option_id
      out_text
    }
  }
`
