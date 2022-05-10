import { gql } from '@apollo/client'

export const loginMutation = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      jwt
      unverified
    }
  }
`

export const resendVerificationEmailMutation = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`
