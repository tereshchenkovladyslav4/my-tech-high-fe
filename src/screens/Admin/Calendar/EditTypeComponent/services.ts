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

export const getEventsQuery = gql`
  query EventsByRegionId($regionId: Float!) {
    eventsByRegionId(region_id: $regionId) {
      EventType {
        priority
        color
        name
        RegionId
      }
      TypeId
      description
      end_date
      event_id
      start_date
      time
      title
      filter_grades
      filter_other
      filter_program_year
      filter_provider
      filter_school_of_enrollment
      filter_users
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

export const createEventMutation = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      event_id
    }
  }
`
