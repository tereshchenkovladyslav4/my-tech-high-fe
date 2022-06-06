import { Announcement } from '../Announcements/types'

export type AnnouncementSectionProps = {
  inProp: boolean
  setSectionName: (value: string) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
