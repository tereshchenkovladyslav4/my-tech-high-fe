import { gql } from '@apollo/client'

export const createQuickLinkMutation = gql`
  mutation CreateQuickLink($quickLinkInput: QuickLinkInput!) {
    createQuickLink(quickLinkInput: $quickLinkInput) {
      id
    }
  }
`

export const updateQuickLinkMutation = gql`
  mutation UpdateQuickLink($quickLinkInput: QuickLinkInput!) {
    updateQuickLink(quickLinkInput: $quickLinkInput) {
      id
    }
  }
`

export const removeQuickLinkPhotoMutation = gql`
  mutation RemoveQuickLinkPhoto($id: ID!) {
    removeQuickLinkPhoto(id: $id) {
      id
    }
  }
`
