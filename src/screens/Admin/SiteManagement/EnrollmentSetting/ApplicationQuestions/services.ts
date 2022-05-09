import { gql } from '@apollo/client'

export const getQuestionsGql = gql`
  query getApplicationQuestions($input: ApplicatinQuestionsInput) {
    getApplicationQuestions(input: $input) {
      id
      type
      order
      question
      options
      required
      validation
      student_question
      default_question
      slug
    }
  }
`

export const saveQuestionsGql = gql`
  mutation saveApplicationQuestions($input: [NewApplicationQuestionsInput!]!) {
    saveApplicationQuestions(data: $input)
  }
`
export const deleteQuestionGql = gql`
  mutation deleteApplicationQuestion($id: Int!) {
    deleteApplicationQuestion(id: $id)
  }
`
