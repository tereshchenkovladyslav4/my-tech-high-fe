import { gql } from '@apollo/client'

export const createOrUpdateResourceMutation = gql`
  mutation CreateOrUpdateResource($createResourceInput: CreateOrUpdateResourceInput!) {
    createOrUpdateResource(createResourceInput: $createResourceInput) {
      resource_id
    }
  }
`
