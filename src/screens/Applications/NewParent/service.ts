import { gql } from '@apollo/client'

export const newParentApplicationMutation = gql`
  mutation NewParentApplication($createApplicationInput: CreateApplicationInput!) {
    createNewApplication(createApplicationInput: $createApplicationInput) {
      parent {
        parent_id
      }
    }
  }
`

export const checkEmailQuery = gql`
  query CheckEmail($email: String!) {
    emailTaken(email: $email)
  }
`