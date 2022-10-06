import { gql } from '@apollo/client'
import { Resource } from '@mth/screens/HomeroomStudentProfile/Resources/types'

export const getStudentResourcesQuery = gql`
  query StudentResources($studentId: ID!) {
    studentResources(studentId: $studentId) {
      resource_id
      SchoolYearId
      title
      image
      subtitle
      price
      website
      grades
      std_user_name
      std_password
      detail
      resource_limit
      add_resource_level
      ResourceLevels {
        resource_level_id
        name
        limit
        TotalRequests
      }
      SchoolYear {
        date_begin
        date_end
        school_year_id
        homeroom_resource_open
        homeroom_resource_close
      }
      family_resource
      priority
      is_active
      allow_request
      HiddenByStudent
      CartDate
      WaitListConfirmed
      ResourceLevelId
      RequestStatus
      TotalRequests
    }
  }
`

export const toggleHiddenResourceMutation = gql`
  mutation ToggleHiddenResource($toggleHiddenResourceInput: ToggleHiddenResourceInput!) {
    toggleHiddenResource(toggleHiddenResourceInput: $toggleHiddenResourceInput)
  }
`

export const toggleResourceCartMutation = gql`
  mutation ToggleResourceCart($toggleResourceCartInput: ToggleResourceCartInput!) {
    toggleResourceCart(toggleResourceCartInput: $toggleResourceCartInput)
  }
`

export const requestResourcesMutation = gql`
  mutation RequestResources($requestResourcesInput: RequestResourcesInput!) {
    requestResources(requestResourcesInput: $requestResourcesInput)
  }
`

export const isFullResource = (resource: Resource): boolean => {
  const resourceLevel = resource.ResourceLevels?.find(
    (resourceLevel) => resourceLevel.resource_level_id == resource.ResourceLevelId,
  )
  const limitSum = resource.ResourceLevels?.reduce((acc, cur) => (acc += cur?.limit || 0), 0)
  return (
    (!!resource.resource_limit && resource.resource_limit <= resource.TotalRequests) ||
    (!!limitSum && limitSum <= resource.TotalRequests) ||
    (!!resourceLevel?.limit && resourceLevel?.limit <= resourceLevel?.TotalRequests)
  )
}

export const shouldConfirmWaitlist = (resource: Resource): boolean => {
  return !resource.WaitListConfirmed && isFullResource(resource)
}
