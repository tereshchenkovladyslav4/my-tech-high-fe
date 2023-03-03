import { DashboardSection } from '../types'

export type Announcement = {
  id?: number
  subject?: string
  body?: string
  sender?: string
  announcementId?: number
  announcement_id?: number
  userId?: number
  date?: string
  grades?: string
  regionId?: number
  isArchived?: boolean | number
  postedBy?: string
  status?: string
  filterGrades?: string
  filterUsers?: string
  filterProgramYears?: string
  filterSchoolPartners?: string
  filterOthers?: string
  filterProviders?: string
  scheduleTime?: Date | string
  user_id?: number
  filter_grades?: string
  RegionId?: number
  posted_by?: string
  filter_users?: string
  filter_program_years?: string
  filter_school_partners?: string
  filter_others?: string
  filter_providers?: string
  schedule_time?: Date
}

export type AnnnouncementProps = {
  announcements: Announcement[]
  setAnnouncements: (value: Announcement[]) => void
  setSectionName: (value: DashboardSection) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
