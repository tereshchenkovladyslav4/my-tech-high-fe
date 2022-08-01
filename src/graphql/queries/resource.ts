import { gql } from '@apollo/client'

export const getResourcesQuery = gql`
  query Resources($schoolYearId: ID!) {
    resources(schoolYearId: $schoolYearId) {
      resource_id
      SchoolYearId
      title
      showCost
      cost
      image
      sequence
      website
      hidden
      allowRequest
    }
  }
`
