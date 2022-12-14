import { gql } from '@apollo/client'

export const confirmAccount = gql`
  mutation Verify($verifyInput: VerifyInput!) {
    verify(verifyInput: $verifyInput) {
      email
      status
      token
      level
    }
  }
`

export const sendApplicationEmail = gql`
  mutation SendApplicationReceiveEmail($email: String!) {
    sendApplicationReceiveEmail(email: $email)
  }
`
