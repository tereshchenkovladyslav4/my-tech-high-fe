import { gql } from '@apollo/client'

export const getApplicationsQuery = gql`
  query Applications(
    $skip: Int
    $take: Int
    $filter: ApplicationFilters
    $regionId: Int
    $sort: String
    $search: String
  ) {
    applications(skip: $skip, take: $take, filter: $filter, region_id: $regionId, sort: $sort, search: $search) {
      total
      results {
        relation_status
        status
        hidden
        student_id
        date_submitted
        application_id
        referred_by
        school_year_id
        midyear_application
        application_emails {
          subject
          created_at
          body
          from_email
        }
        school_year {
          date_begin
          date_end
          midyear_application_open
          midyear_application_close
        }
        student {
          student_id
          grade_level
          grade_levels {
            grade_level
          }
          special_ed
          parent {
            parent_id
            person {
              first_name
              last_name
              email
              email_verifier {
                verified
                user_id
              }
              phone {
                number
              }
            }
          }
          person {
            first_name
            last_name
          }
        }
      }
    }
  }
`

export const approveApplicationMutation = gql`
  mutation AcceptApplication($acceptApplicationInput: AcceptApplicationInput!) {
    acceptApplication(acceptApplicationInput: $acceptApplicationInput) {
      application_id
      status
    }
  }
`

export const deleteApplicationMutation = gql`
  mutation DeleteApplication($deleteApplicationInput: DeleteApplicationInput!) {
    deleteApplication(deleteApplicationInput: $deleteApplicationInput) {
      application_id
      status
    }
  }
`

export const emailApplicationMutation = gql`
  mutation EmailApplication($emailApplicationInput: EmailApplicationInput!) {
    emailApplication(emailApplicationInput: $emailApplicationInput) {
      application_id
    }
  }
`

export const moveThisYearApplicationMutation = gql`
  mutation MoveThisYearApplication($deleteApplicationInput: DeleteApplicationInput!) {
    moveThisYearApplication(deleteApplicationInput: $deleteApplicationInput)
  }
`

export const moveNextYearApplicationMutation = gql`
  mutation MoveNextYearApplication($deleteApplicationInput: DeleteApplicationInput!) {
    moveNextYearApplication(deleteApplicationInput: $deleteApplicationInput)
  }
`

export const getSchoolYearQuery = gql`
  query SchoolYears {
    schoolYears {
      school_year_id
      date_begin
      date_end
    }
  }
`

export const updateApplicationMutation = gql`
  mutation UpdateApplication($updateApplicationInput: UpdateApplicationInput!) {
    updateApplication(updateApplicationInput: $updateApplicationInput) {
      status
      application_id
    }
  }
`

export const toggleHideApplicationMutation = gql`
  mutation ToggleHideApplication($updateApplicationInput: UpdateApplicationInput!) {
    toggleHideApplication(updateApplicationInput: $updateApplicationInput) {
      status
      application_id
    }
  }
`
