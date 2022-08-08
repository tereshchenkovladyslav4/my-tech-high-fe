import { gql } from '@apollo/client'

export const createOrUpdateResourceMutation = gql`
  mutation CreateOrUpdateResource($createResourceInput: CreateOrUpdateResourceInput!) {
    createOrUpdateResource(createResourceInput: $createResourceInput) {
      resource_id
    }
  }
`

export const deleteResourceMutation = gql`
  mutation DeleteResource($resourceId: Float!) {
    deleteResource(resource_id: $resourceId)
  }
`
