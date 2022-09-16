import { Announcement } from '../Announcements/types'
import { DashboardSection } from '../types'

export type AnnouncementSectionProps = {
  inProp: boolean
  setSectionName: (value: DashboardSection) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
