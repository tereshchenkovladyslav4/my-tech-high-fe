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
  mutation DeleteUserAnnouncementById($id: Int!) {
    deleteUserAnnouncementById(id: $id) {
      error
      message
    }
  }
`

export const markRead = gql`
  mutation MarkRead($id: Int!) {
    markRead(id: $id) {
      id
    }
  }
`

export const deleteUserAnnouncementByUserId = gql`
  mutation DeleteUserAnnouncementsByUserId($userId: Int!) {
    deleteUserAnnouncementsByUserId(user_id: $userId) {
      error
      message
    }
  }
`

export const getSchedulePeriodByProviderIds = gql`
  query SchedulePeriodByProviderIds($providerIds: String!) {
    schedulePeriodsByProvider(providerIds: $providerIds) {
      PeriodId
      ProviderId
      ScheduleId
    }
  }
`
