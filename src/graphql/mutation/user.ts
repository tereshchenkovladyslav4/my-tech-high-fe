import { gql } from '@apollo/client'

export const createUserMutation = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      email
    }
  }
`

export const updateUserMutation = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(updateUserInput: $input) {
      email
    }
  }
`

export const changeUserStatusMutation = gql`
  mutation ChangeUserStatus($user_id: ID!, $status: String!, $creator_id: Int!) {
    changeUserStatus(user_id: $user_id, status: $status, creator_id: $creator_id) {
      user_id
      email
      status
    }
  }
`

export const toggleMasqueradeMutation = gql`
  mutation ToggleMasquerade($masqueradeInput: MasqueradeInput!) {
    toggleMasquerade(masqueradeInput: $masqueradeInput) {
      user_id
    }
  }
`
export const becomeUserMutation = gql`
  mutation BecomeUser($userId: Float!) {
    masqueradeUser(userId: $userId) {
      jwt
    }
  }
`
