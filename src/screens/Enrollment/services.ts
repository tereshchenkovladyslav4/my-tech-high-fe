import { gql } from '@apollo/client'

export const getParentQuestionsGql = gql`
  query getParentEnrollmentQuestions($input: EnrollmentQuestionsInput) {
    getParentEnrollmentQuestions(input: $input) {
      id
      tab_name
      is_active
      region_id
      groups {
        id
        group_name
        tab_id
        order
        questions {
          id
          question
          group_id
          order
          options
          additional
          additional2
          required
          removable
          type
          slug
          default_question
          display_admin
          validation
        }
      }
    }
  }
`

export const getRegionByUserId = gql`
  query UserRegionByUserId($userId: ID!) {
    userRegionByUserId(user_id: $userId) {
      region_id
    }
  }
`