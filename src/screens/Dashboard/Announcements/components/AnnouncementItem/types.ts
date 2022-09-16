import { DashboardSection } from '@mth/screens/Dashboard/types'
import { Announcement } from '../../types'

export type AnnouncementItemProps = {
  announcement: Announcement
  onClose: () => void
  setSectionName: (value: DashboardSection) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
