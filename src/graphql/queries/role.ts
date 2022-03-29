import { gql } from '@apollo/client'

export const getAllRoles = gql`
  query Roles {
    roles  {
        id
        name
        level
    }
  }
`
