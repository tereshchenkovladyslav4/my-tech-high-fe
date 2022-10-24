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
  isArchived?: boolean
  postedBy?: string
  status?: string
  filterGrades?: string
  filterUsers?: string
  filterOthers?: string
  scheduleTime?: Date
  user_id?: number
  filter_grades?: string
  RegionId?: number
  posted_by?: string
  filter_users?: string
  schedule_time?: Date
}

export type AnnnouncementProps = {
  announcements: Announcement[]
  setAnnouncements: (value: Announcement[]) => void
  setSectionName: (value: DashboardSection) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
