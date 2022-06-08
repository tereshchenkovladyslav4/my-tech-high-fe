import { gql } from '@apollo/client'

export const getEventTypesQuery = gql`
  query EventTypes($regionId: Float!) {
    eventTypes(region_id: $regionId) {
      RegionId
      archived
      color
      created_date
      event_type_id
      name
      priority
      updated_date
    }
  }
`

export const createEventTypeMutation = gql`
  mutation CreateEventType($createEventTypeInput: CreateEventTypeInput!) {
    createEventType(createEventTypeInput: $createEventTypeInput) {
      event_type_id
    }
  }
`

export const updateEventTypeMutation = gql`
  mutation UpdateEventType($updateEventTypeInput: UpdateEventTypeInput!) {
    updateEventType(updateEventTypeInput: $updateEventTypeInput) {
      event_type_id
    }
  }
`

export const updateEventTypesMutation = gql`
  mutation UpdateEventTypes($updateEventTypeInputs: UpdateEventTypeInputs!) {
    updateEventTypes(updateEventTypeInputs: $updateEventTypeInputs) {
      event_type_id
    }
  }
`
