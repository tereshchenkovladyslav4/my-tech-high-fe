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
