import { gql } from '@apollo/client'

export const emailApplicationMutation = gql`
  mutation EmailApplication($emailApplicationInput: EmailApplicationInput!) {
    emailApplication(emailApplicationInput: $emailApplicationInput) {
      application_id
    }
  }
`

export const emailScheduleMutation = gql`
  mutation EmailSchedule($emailScheduleInput: EmailScheduleInput!) {
    emailSchedule(emailScheduleInput: $emailScheduleInput) {
      schedule_id
    }
  }
`

export const getSchedulesQuery = gql`
  query Schedules($skip: Int, $take: Int, $filter: ScheduleFilters, $regionId: Int, $sort: String, $search: String) {
    schedules(skip: $skip, take: $take, filter: $filter, region_id: $regionId, sort: $sort, search: $search) {
      total
      results {
        ScheduleEmails {
          body
          created_at
          from_email
          subject
        }
        schedule_id
        date_submitted
        status
        ScheduleStudent {
          student_id
          grade_level
          person {
            user_id
            first_name
            last_name
          }
          parent {
            person {
              first_name
              last_name
            }
          }
          diploma_seeking
        }
      }
    }
  }
`

export const updateScheduleMutation = gql`
  mutation CreateOrUpdateSchedule($createScheduleInput: CreateOrUpdateScheduleInput!) {
    createOrUpdateSchedule(createScheduleInput: $createScheduleInput) {
      schedule_id
      status
    }
  }
`

export const scheduleCountQuery = gql`
  query ScheduleCountByRegionId($scheduleGroupCountArgs: SchedulesGroupCountArgs!) {
    scheduleCountByRegionId(scheduleGroupCountArgs: $scheduleGroupCountArgs) {
      error
      message
      results
    }
  }
`

export const scheduleCountGroupQuery = gql`
  query ScheduleCountGroup {
    scheduleCount {
      error
      message
      results
    }
  }
`
