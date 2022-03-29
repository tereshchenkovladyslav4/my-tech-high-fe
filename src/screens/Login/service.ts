import { gql } from '@apollo/client'

export const loginMutation = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      jwt
    }
  }
`
