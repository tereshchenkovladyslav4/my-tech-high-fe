import { gql } from '@apollo/client'
export const getAnnouncementsQuery = gql`
  query Announcements {
    announcements {
      RegionId
      announcement_id
      body
      date
      filter_grades
      filter_users
      schedule_time
      posted_by
      status
      subject
    }
  }
`

export const CreateAnnouncementMutation = gql`
  mutation CreateAnnoucement($createAnnoucementInput: CreateAnnouncementInput!) {
    createAnnoucement(createAnnoucementInput: $createAnnoucementInput) {
      announcement_id
      date
      filter_grades
      filter_users
      status
      subject
      posted_by
    }
  }
`

export const UpdateAnnouncementMutation = gql`
  mutation UpdateAnouncement($updateAnnouncementInput: UpdateAnnouncementInput!) {
    updateAnouncement(updateAnnouncementInput: $updateAnnouncementInput) {
      announcement_id
      date
      filter_grades
      filter_users
      status
      subject
      posted_by
    }
  }
`
