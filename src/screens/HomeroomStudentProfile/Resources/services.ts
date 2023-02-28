import { gql } from '@apollo/client'
import { HomeroomResource } from '@mth/models'

export const getActiveHomeroomResourceSchoolYearsQuery = gql`
  query ActiveHomeroomResourceSchoolYears($studentId: Int!) {
    activeHomeroomResourceSchoolYears(studentId: $studentId) {
      school_year_id
      date_begin
      date_end
    }
  }
`

export const getStudentResourcesQuery = gql`
  query StudentResources($studentId: Int!, $schoolYearId: Int!) {
    studentResources(studentId: $studentId, schoolYearId: $schoolYearId) {
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
      ResourceRequests {
        username
        password
      }
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

export const isFullResource = (resource: HomeroomResource): boolean => {
  const resourceLevel = resource.ResourceLevels?.find(
    (resourceLevel) => resourceLevel.resource_level_id == resource.ResourceLevelId,
  )
  const limitSum = resource.ResourceLevels?.reduce((acc, cur) => (acc += cur?.limit || 0), 0)
  return (
    (!!resource.resource_limit && resource.resource_limit <= resource.TotalRequests) ||
    (!!limitSum && limitSum <= resource.TotalRequests) ||
    (!!resourceLevel?.limit && !!resourceLevel?.TotalRequests && resourceLevel?.limit <= resourceLevel?.TotalRequests)
  )
}

export const shouldConfirmWaitlist = (resource: HomeroomResource): boolean => {
  return !resource.WaitListConfirmed && isFullResource(resource)
}
