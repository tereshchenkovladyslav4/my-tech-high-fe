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
        id
        student_id
        resource_id
        resource_level_id
        status
        created_at
        updated_at
        Student {
          student_id
          username_first_last
          username_last_first
          username_last_first_year
          username_last_firstinitial
          username_last_first_mth
          username_last_first_birth
          username_first_last_domain
          username_student_email
          username_parent_email
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
          applications {
            midyear_application
            school_year_id
          }
          status {
            school_year_id
            status
          }
          grade_levels {
            school_year_id
            grade_level
          }
        }
        Resource {
          subtitle
          price
          std_username_format
          std_user_name
          std_password
          title
          ResourceLevels {
            resource_level_id
            name
            limit
          }
        }
        ResourceLevel {
          name
        }
        ResourceRequestEmails {
          id
          resource_request_id
          email_record_id
          subject
          body
          from_email
          created_at
        }
      }
    }
  }
`
