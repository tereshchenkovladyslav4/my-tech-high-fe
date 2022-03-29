import { gql } from '@apollo/client'

export const getAllAccess = gql`
  query getAllAccesses {
    getAllAccesses  {
        id
        name
    }
  }
`
