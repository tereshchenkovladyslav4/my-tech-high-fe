import { gql } from '@apollo/client'

export const deleteSchoolYearByIdMutation = gql`
  mutation Mutation($schoolYearId: Float!) {
    deleteSchoolYear(school_year_id: $schoolYearId)
  }
`
