import { gql } from '@apollo/client'

export const saveScheduleMutation = gql`
  mutation CreateOrUpdateSchedule($createScheduleInput: CreateOrUpdateScheduleInput!) {
    createOrUpdateSchedule(createScheduleInput: $createScheduleInput) {
      schedule_id
    }
  }
`

export const sendUpdatesRequiredEmailMutation = gql`
  mutation SendUpdatesRequiredEmail($updateRequiredEmail: EmailUpdatesRequiredInput!) {
    sendUpdatesRequiredEmail(updateRequiredEmail: $updateRequiredEmail)
  }
`

export const sendUpdatesAllowedEmailMutation = gql`
  mutation SendUpdatesAllowedEmail($updatesAllowedEmail: EmailUpdatesAllowedInput!) {
    sendUpdatesAllowedEmail(updatesAllowedEmail: $updatesAllowedEmail)
  }
`

export const restoreScheduleHistoryMutation = gql`
  mutation RestoreScheduleHistory($scheduleHistoryId: Int!) {
    restoreScheduleHistory(schedule_history_id: $scheduleHistoryId)
  }
`
