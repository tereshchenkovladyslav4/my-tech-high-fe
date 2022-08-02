import { FunctionComponent } from 'react'

export type Announcement = {
  id?: number
  subject?: string
  body?: string
  sender?: string
  announcementId?: number
  userId?: number
  date?: string
  grades?: string
  regionId?: number
  isArchived?: boolean
  postedBy?: string
  status?: string
  filterGrades?: string
  filterUsers?: string
  scheduleTime?: Date
  announcement_id?: Date
  user_id?: number
  filter_grades?: string
  RegionId?: number
  posted_by?: string
  filter_users?: string
  schedule_time?: Date
}

type AnnnouncementProps = {
  announcements: Announcement[]
  setAnnouncements: (value: Announcement[]) => void
  setSectionName: (value: React.SetStateAction<string>) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
export type AnnouncementTemplateType = FunctionComponent<AnnnouncementProps>
