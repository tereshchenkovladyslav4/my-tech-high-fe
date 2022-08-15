import { gql } from '@apollo/client'

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
      resource_level
      family_resource
      priority
      is_active
      allow_request
      HiddenByStudent
      CartDate
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
