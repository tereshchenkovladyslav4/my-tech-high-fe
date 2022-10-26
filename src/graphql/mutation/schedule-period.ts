import { gql } from '@apollo/client'

export const saveSchedulePeriodMutation = gql`
  mutation CreateOrUpdateSchedulePeriod($createSchedulePeriodInput: schedulePeriodInput!) {
    createOrUpdateSchedulePeriod(createSchedulePeriodInput: $createSchedulePeriodInput) {
      schedule_period_id
    }
  }
`
