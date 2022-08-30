import { Announcement } from '../../types'

export type AnnouncmentItemProps = {
  announcement: Announcement
  onClose: () => void
  setSectionName: (value: React.SetStateAction<string>) => void
  setSelectedAnnouncement: (value: Announcement) => void
}
