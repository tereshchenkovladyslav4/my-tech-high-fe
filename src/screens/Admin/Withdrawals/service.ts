import { gql } from '@apollo/client'

export const emailWithdrawalMutation = gql`
  mutation EmailWithdrawal($emailWithdrawalInput: EmailWithdrawalInput!) {
    emailWithdrawal(emailWithdrawalInput: $emailWithdrawalInput) {
      withdrawal_email_id
    }
  }
`
