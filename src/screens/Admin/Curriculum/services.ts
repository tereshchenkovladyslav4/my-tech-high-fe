import { gql } from '@apollo/client'

export const createOrUpdateResourceMutation = gql`
  mutation CreateOrUpdateResource($createResourceInput: CreateOrUpdateResourceInput!) {
    createOrUpdateResource(createResourceInput: $createResourceInput) {
      resource_id
    }
  }
`

export const deleteResourceMutation = gql`
  mutation DeleteResource($resourceId: Float!) {
    deleteResource(resource_id: $resourceId)
  }
`

export const createOrUpdateScheduleBuilder = gql`
  mutation CreateOrUpdateScheduleBuilder($scheduleBuilderInput: CreateScheduleBuilderInput!) {
    createOrUpdateScheduleBuilder(scheduleBuilderInput: $scheduleBuilderInput) {
      id
      max_num_periods
      custom_built
      split_enrollment
      always_unlock
      parent_tooltip
      school_year_id
      third_party_provider
    }
  }
`

export const getScheduleBuilder = gql`
  query Schoolyear_getcurrent($regionId: Int!) {
    schoolyear_getcurrent(region_id: $regionId) {
      ScheduleBuilder {
        id
        max_num_periods
        custom_built
        split_enrollment
        always_unlock
        parent_tooltip
        school_year_id
        third_party_provider
      }
    }
  }
`
