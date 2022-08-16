import { gql } from '@apollo/client'

export const updateRegionMutation = gql`
  mutation UpdateRegion($updateRegionInput: UpdateRegionInput!) {
    updateRegion(updateRegionInput: $updateRegionInput) {
      id
      resource_confirm_details
    }
  }
`
