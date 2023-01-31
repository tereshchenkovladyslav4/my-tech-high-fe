import { gql } from '@apollo/client'

export const diplomaQuestionForStudent = gql`
  query GetDiplomaQuestionForStudent($studentId: Int!, $schoolYearId: Int!) {
    getDiplomaQuestionForStudent(studentId: $studentId, schoolYearId: $schoolYearId) {
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
