import { Announcement } from '../Announcements/types'

export type ReadMoreSectionProps = {
  inProp?: boolean
  announcement: Announcement | null
  setSectionName: (value: React.SetStateAction<string>) => void
}
