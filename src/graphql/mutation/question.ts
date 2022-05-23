import { gql } from '@apollo/client';

export const saveQuestionsMutation = gql`
  mutation SaveQuestions($questionsInput: [QuestionInput!]!) {
    saveQuestions(questionsInput: $questionsInput)
  }
`

export const deleteQuestionMutation = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id) {
      id
    }
  }
`
