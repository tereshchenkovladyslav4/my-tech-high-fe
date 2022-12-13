import { gql } from '@apollo/client'
export const getAnnouncementsQuery = gql`
  query Announcements($regionId: Int!) {
    announcements(region_id: $regionId) {
      RegionId
      announcement_id
      body
      date
      filter_grades
      filter_users
      filter_others
      filter_providers
      posted_by
      schedule_time
      status
      subject
      isArchived
    }
  }
`

export const CreateAnnouncementMutation = gql`
  mutation CreateAnnouncement($createAnnouncementInput: CreateAnnouncementInput!) {
    createAnnouncement(createAnnouncementInput: $createAnnouncementInput) {
      announcement_id
      date
      filter_grades
      filter_users
      filter_providers
      status
      subject
      posted_by
    }
  }
`

export const UpdateAnnouncementMutation = gql`
  mutation UpdateAnnouncement($updateAnnouncementInput: UpdateAnnouncementInput!) {
    updateAnnouncement(updateAnnouncementInput: $updateAnnouncementInput) {
      announcement_id
      date
      filter_grades
      filter_users
      filter_providers
      status
      subject
      posted_by
    }
  }
`

export const GetCurrentSchoolYearByRegionId = gql`
  query Schoolyear_getcurrent($regionId: Int!) {
    schoolyear_getcurrent(region_id: $regionId) {
      school_year_id
      grades
      RegionId
      date_begin
      date_end
      enrollment_packet
      midyear_application
      midyear_application_open
      midyear_application_close
      SchoolPartners {
        abbreviation
        active
        school_partner_id
      }
      ScheduleBuilder {
        id
        max_num_periods
        custom_built
        split_enrollment
        always_unlock
        parent_tooltip
        school_year_id
      }
      schedule
      diploma_seeking
      testing_preference
    }
  }
`

export const deleteAnnouncementsById = gql`
  mutation deleteAnnouncementsById($id: Int!) {
    deleteAnnouncementsById(id: $id) {
      error
      message
    }
  }
`
