import { gql } from '@apollo/client'

export const saveScheduleMutation = gql`
  mutation CreateOrUpdateSchedule($createScheduleInput: CreateOrUpdateScheduleInput!) {
    createOrUpdateSchedule(createScheduleInput: $createScheduleInput) {
      schedule_id
    }
  }
`

export const sendEmailUpdateRequired = gql`
  mutation UpdateRequiredEmail($updateRequiredEmail: EmailUpdateRequiredInput!) {
    updateRequiredEmail(updateRequiredEmail: $updateRequiredEmail)
  }
`
