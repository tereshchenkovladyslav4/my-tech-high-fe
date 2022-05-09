import { gql } from '@apollo/client'

export const getQuestionsGql = gql`
  query getEnrollmentQuestions($input: EnrollmentQuestionsInput) {
    getEnrollmentQuestions(input: $input) {
      id
      tab_name
      is_active
      region_id
      groups {
        id
        group_name
        tab_id
        order
        questions {
          id
          question
          group_id
          order
          options
          additional
          additional2
          required
          removable
          type
          slug
          default_question
          student_question
          validation
        }
      }
    }
  }
`

export const saveQuestionsGql = gql`
  mutation saveEnrollmentQuestions($input: [NewEnrollmentQuestionTabInput!]!) {
    saveEnrollmentQuestions(data: $input)
  }
`
export const deleteQuestionsGql = gql`
  mutation deleteEnrollmentQuestions($id: Int!) {
    deleteEnrollmentQuestions(id: $id)
  }
`
export const deleteQuestionGroupGql = gql`
  mutation deleteEnrollmentQuestionGroup($id: Int!) {
    deleteEnrollmentQuestionGroup(id: $id)
  }
`