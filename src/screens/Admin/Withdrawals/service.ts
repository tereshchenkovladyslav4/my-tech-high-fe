import { gql } from '@apollo/client'

export const emailWithdrawalMutation = gql`
  mutation EmailWithdrawal($emailWithdrawalInput: EmailWithdrawalInput!) {
    emailWithdrawal(emailWithdrawalInput: $emailWithdrawalInput) {
      withdrawal_email_id
    }
  }
`

export const updateWithdrawalMutation = gql`
  mutation UpdateWithdrawal($updateWithdrawalInput: UpdateWithdrawalInput!) {
    updateWithdrawal(updateWithdrawalInput: $updateWithdrawalInput)
  }
`

export const quickWithdrawalMutation = gql`
  mutation QuickWithdrawal($quickWithdrawalInput: QuickWithdrawalInput!) {
    quickWithdrawal(quickWithdrawalInput: $quickWithdrawalInput)
  }
`

export const reinstateWithdrawalMutation = gql`
  mutation ReinstateWithdrawal($reinstateWithdrawalInput: ReinstateWithdrawalInput!) {
    reinstateWithdrawal(reinstateWithdrawalInput: $reinstateWithdrawalInput)
  }
`

export const getStudentInfoByWithdrawalId = gql`
  query GetStudentInfoByWithdrawalId($withdrawId: Int!) {
    getStudentInfoByWithdrawalId(withdrawId: $withdrawId) {
      first_name
      grade
      last_name
      parent_id
      school_of_enrollment
      student_id
      withdrawal_id
    }
  }
`

export const individualWithdrawalMutation = gql`
  mutation IndividualWithdrawal($individualWithdrawalInput: IndividualWithdrawalInput!) {
    individualWithdrawal(individualWithdrawalInput: $individualWithdrawalInput)
  }
`
