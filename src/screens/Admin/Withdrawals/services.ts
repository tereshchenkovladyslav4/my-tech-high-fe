import { gql } from '@apollo/client'

export const getWithdrawalsQuery = gql`
  query Withdrawals($regionId: Float!) {
    withdrawals(region_id: $regionId) {
      StudentId
      date
      date_effective
      date_emailed
      first_name
      funding
      grade_level
      last_name
      soe
      status
      withdrawal_id
    }
  }
`
