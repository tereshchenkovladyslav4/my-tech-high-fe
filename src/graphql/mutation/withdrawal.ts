import { gql } from '@apollo/client'

export const saveWithdrawalMutation = gql`
  mutation SaveWithdrawal($withdrawalInput: WithdrawalInput!) {
    saveWithdrawal(withdrawalInput: $withdrawalInput)
  }
`

export const deleteWithdrawalMutation = gql`
  mutation DeleteWithdrawal($studentId: Int!) {
    deleteWithdrawal(student_id: $studentId)
  }
`
