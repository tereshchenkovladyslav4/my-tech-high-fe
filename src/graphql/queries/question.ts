import { gql } from '@apollo/client'

export const getQuestionsByRegionQuery = gql`
  query QuestionsByRegion($withdrawQuestionInput: WithdrawQuestionInput!) {
    questionsByRegion(withdrawQuestionInput: $withdrawQuestionInput) {
      id
      region_id
      section
      type
      sequence
      question
      options
      slug
      validation
      mainQuestion
      defaultQuestion
      additionalQuestion
      required
    }
  }
`
