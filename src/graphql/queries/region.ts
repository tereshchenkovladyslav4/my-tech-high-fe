import { gql } from '@apollo/client'

export const getAllRegion = gql`
  query Regions {
    regions {
      id
      name
    }
  }
`
