import { gql } from '@apollo/client'

export const saveReimbursementQuestionsMutation = gql`
  mutation CreateOrUpdateReimbursementQuestions($questionInputs: CreateOrUpdateReimbursementQuestionsInput!) {
    createOrUpdateReimbursementQuestions(questionInputs: $questionInputs) {
      reimbursement_question_id
    }
  }
`

export const deleteReimbursementQuestionMutation = gql`
  mutation DeleteReimbursementQuestion($remimbursementQuestionId: Float!) {
    deleteReimbursementQuestion(remimbursement_question_id: $remimbursementQuestionId)
  }
`
