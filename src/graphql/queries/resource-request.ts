import { gql } from '@apollo/client'

export const getResourceRequestsQuery = gql`
  query ResourceRequests(
    $schoolYearId: Int!
    $skip: Int
    $take: Int
    $filter: ResourceRequestFilters
    $sort: String
    $search: String
  ) {
    resourceRequests(
      schoolYearId: $schoolYearId
      skip: $skip
      take: $take
      filter: $filter
      sort: $sort
      search: $search
    ) {
      total
      results {
        student_id
        resource_id
        resource_level_id
        status
        created_at
        updated_at
        Student {
          student_id
          person {
            first_name
            last_name
            email
            date_of_birth
          }
          parent {
            person {
              first_name
              last_name
              email
            }
          }
          status {
            school_year_id
            status
          }
        }
        Resource {
          subtitle
          price
          std_user_name
          std_password
        }
        ResourceLevel {
          name
        }
      }
    }
  }
`
