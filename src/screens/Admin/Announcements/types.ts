import { FunctionComponent } from 'react'

export type AnnouncementType = {
  id: number
  date: string
  subject: string
  postedBy: string
  status: string
  filterGrades: string
  filterUsers: string
  regionId: string
  body: string
  scheduleTime: Date
}
