import { makeStyles } from '@material-ui/core'

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
  isArchived: boolean
}

export const toolTipStyles = makeStyles(() => ({
  customTooltip: {
    backgroundColor: '#767676',
    fontSize: '14px',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 9,
    paddingBottom: 9,
  },
}))
