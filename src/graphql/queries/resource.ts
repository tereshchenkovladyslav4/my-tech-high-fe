import { gql } from '@apollo/client'

export const getResourcesQuery = gql`
  query Resources($schoolYearId: ID!) {
    resources(schoolYearId: $schoolYearId) {
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
    }
  }
`
