import { gql } from '@apollo/client'

export const getAllScheduleBuilderQuery = gql`
  query GetScheduleBuilder($schoolYearId: ID!) {
    getScheduleBuilder(schoolYearId: $schoolYearId) {
      always_unlock
      custom_built
      id
      max_num_periods
      parent_tooltip
      school_year_id
      split_enrollment
      third_party_provider
    }
  }
`
