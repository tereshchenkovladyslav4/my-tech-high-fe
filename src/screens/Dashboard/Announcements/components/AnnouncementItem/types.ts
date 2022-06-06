import { FunctionComponent } from 'react'
import { Announcement } from '../../types'

type AnnouncmentItemProps = {
  announcement: Announcement
  onClose: () => void
  setSectionName: (value: React.SetStateAction<string>) => void
  setSelectedAnnouncement: (value: Announcement) => void
}

export type AnnouncmentTemplateType = FunctionComponent<AnnouncmentItemProps>
