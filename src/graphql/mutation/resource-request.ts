import { gql } from '@apollo/client'

export const acceptResourceRequestsMutation = gql`
  mutation AcceptResourceRequests($resourceRequestsActionInput: ResourceRequestsActionInput!) {
    acceptResourceRequests(resourceRequestsActionInput: $resourceRequestsActionInput)
  }
`

export const removeResourceRequestsMutation = gql`
  mutation RemoveResourceRequests($resourceRequestsActionInput: ResourceRequestsActionInput!) {
    removeResourceRequests(resourceRequestsActionInput: $resourceRequestsActionInput)
  }
`

export const deleteResourceRequestsMutation = gql`
  mutation DeleteResourceRequests($resourceRequestsActionInput: ResourceRequestsActionInput!) {
    deleteResourceRequests(resourceRequestsActionInput: $resourceRequestsActionInput)
  }
`

export const emailResourceRequestsMutation = gql`
  mutation EmailResourceRequests($emailResourceRequestsInput: EmailResourceRequestsInput!) {
    emailResourceRequests(emailResourceRequestsInput: $emailResourceRequestsInput) {
      resource_request_id
      EmailRecord {
        id
        status
      }
    }
  }
`

export const updateResourceRequestMutation = gql`
  mutation UpdateResourceRequest($updateResourceRequestInput: UpdateResourceRequestInput!) {
    updateResourceRequest(updateResourceRequestInput: $updateResourceRequestInput) {
      id
    }
  }
`
