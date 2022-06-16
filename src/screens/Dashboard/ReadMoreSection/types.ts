import { AnnouncementType } from '../../Admin/Announcements/types'
import { Announcement } from '../Announcements/types'

export type ReadMoreSectionProps = {
  inProp: boolean
  announcement: Announcement | AnnouncementType
  setSectionName: (value: React.SetStateAction<string>) => void
}
