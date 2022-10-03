import { gql } from '@apollo/client'

export const getEnrollmentQuestionsGql = gql`
  query getEnrollmentQuestions($input: EnrollmentQuestionsInput) {
    getEnrollmentQuestions(input: $input) {
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
          additional_question
          required
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
export const getEnrollmentQuestionsBySlugAndRegionGql = gql`
  query getEnrollmentQuestionsBySlugAndRegion($regionId: ID!, $slug: String!) {
    getEnrollmentQuestionsBySlugAndRegion(regionId: $regionId, slug: $slug) {
      id
      question
      group_id
      order
      options
      required
      type
      slug
      default_question
      display_admin
      validation
    }
  }
`
