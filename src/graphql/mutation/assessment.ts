import { gql } from '@apollo/client'

export const saveAssessmentMutation = gql`
  mutation CreateOrUpdateAssessment($assessmentInput: CreateOrUpdateAssessmentInput!) {
    createOrUpdateAssessment(assessmentInput: $assessmentInput) {
      assessment_id
    }
  }
`

export const deleteAssessmentMutation = gql`
  mutation DeleteAssessment($assessmentId: ID!) {
    deleteAssessment(assessment_id: $assessmentId)
  }
`

export const updateAssessmentsMutation = gql`
  mutation UpdateAssessments($updateAssessmentsInputs: UpdateAssessmentInputs!) {
    updateAssessments(updateAssessmentsInputs: $updateAssessmentsInputs) {
      assessment_id
    }
  }
`

export const updateStudentAssessmentMutation = gql`
  mutation CreateOrUpdateStudentAssessment($studentAssessmentInput: CreateOrUpdateStudentAssessmentInput!) {
    createOrUpdateStudentAssessment(studentAssessmentInput: $studentAssessmentInput) {
      assessment_option_id
      AssessmentId
      StudentId
      OptionId
      out_text
    }
  }
`
