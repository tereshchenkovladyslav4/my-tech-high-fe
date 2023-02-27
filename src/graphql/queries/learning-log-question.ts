import { gql } from '@apollo/client'

export const GetLearingLogQuestionByAssignmentIdQuery = gql`
  query GetLearningLogQuestionByAssignmentId($assignmentId: Int!) {
    getLearningLogQuestionByAssignmentId(assignmentId: $assignmentId) {
      id
      assignment_id
      slug
      parent_slug
      question
      type
      options
      default_question
      grades
      order
      page
      validations
    }
  }
`
// GetLearingLogQuestionByAssignmentIdQuery Variables Structure

// {
//     "assignmentId": null
// }
