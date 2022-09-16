import { Announcement } from '../Announcements/types'
import { DashboardSection } from '../types'

export type ReadMoreSectionProps = {
  inProp?: boolean
  announcement: Announcement | null
  setSectionName: (value: DashboardSection) => void
}
