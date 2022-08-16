import { gql } from '@apollo/client'

export const getRegion = gql`
  query Region($id: ID!) {
    region(id: $id) {
      id
      name
      resource_confirm_details
    }
  }
`

export const getAllRegion = gql`
  query Regions {
    regions {
      id
      name
    }
  }
`
