import { gql } from '@apollo/client'

export const diplomaQuestionForStudent = gql`
  query GetDiplomaQuestionForStudent($diplomaQuestionInput: DiplomaQuestionInput!) {
    getDiplomaQuestionForStudent(diplomaQuestionInput: $diplomaQuestionInput) {
      id
      id
      description
      title
    }
  }
`

export const diplomaAnswerGql = gql`
  query GetDiplomaAnswer($diplomaAnswerInput: DiplomaAnswerInput!) {
    getDiplomaAnswer(diplomaAnswerInput: $diplomaAnswerInput) {
      answer
    }
  }
`

export const submitDiplomaAnswerGql = gql`
  mutation SaveDiplomaAnswer($saveDiplomaAnswerInput: DiplomaAnswerInput!) {
    saveDiplomaAnswer(saveDiplomaAnswerInput: $saveDiplomaAnswerInput) {
      answer
      school_year_id
    }
  }
`
