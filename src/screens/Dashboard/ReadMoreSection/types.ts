import { Announcement } from '../Announcements/types'

export type ReadMoreSectionProps = {
  inProp: boolean
  announcement: Announcement
  setSectionName: (value: React.SetStateAction<string>) => void
}
