import { FunctionComponent } from 'react'

export type Announcement = {
  id: number
  subject: string
  body: string
  sender: string
  announcementId: number
  userId: number
  date: string
  grades: string
  regionId: number
}

type AnnnouncementProps = {
  announcements: Announcement[]
  setAnnouncements: (value: Announcement[]) => void
  setSectionName: (value: React.SetStateAction<string>) => void
}
export type AnnouncementTemplateType = FunctionComponent<AnnnouncementProps>
