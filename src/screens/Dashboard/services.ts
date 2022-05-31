import { gql } from '@apollo/client'

export const getUserAnnouncements = gql`
  query UserAnnouncements($request: UserAnnouncementRequestParams!) {
    userAnnouncements(request: $request) {
      RegionId
      announcement_id
      body
      date
      filter_grades
      id
      sender
      status
      user_id
      subject
    }
  }
`

export const deleteUserAnnouncementById = gql`
  mutation DeleteUserAnnouncementById($id: Float!) {
    deleteUserAnnouncementById(id: $id) {
      error
      message
    }
  }
`

export const deleteUserAnnouncementByUserId = gql`
  mutation DeleteUserAnnouncementsByUserId($userId: Float!) {
    deleteUserAnnouncementsByUserId(user_id: $userId) {
      error
      message
    }
  }
`
