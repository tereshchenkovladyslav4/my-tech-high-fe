import { gql } from '@apollo/client'

export const getWithdrawalsQuery = gql`
  query Withdrawals {
    withdrawals {
      withdrawal_id
      status
      soe
      funding
      date_emailed
      date_effective
      date
      StudentId
      Student {
        grade_levels {
          grade_level
        }
        person {
          first_name
          last_name
        }
      }
    }
  }
`
