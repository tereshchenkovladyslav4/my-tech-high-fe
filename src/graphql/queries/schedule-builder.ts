import { gql } from '@apollo/client'

export const getAllScheduleBuilderQuery = gql`
  query scheduleBuilder {
    scheduleBuilder {
      id
      max_num_periods
    }
  }
`
