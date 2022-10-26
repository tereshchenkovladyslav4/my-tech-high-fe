import { gql } from '@apollo/client'

export const saveScheduleMutation = gql`
  mutation CreateOrUpdateSchedule($createScheduleInput: CreateOrUpdateScheduleInput!) {
    createOrUpdateSchedule(createScheduleInput: $createScheduleInput) {
      schedule_id
    }
  }
`
