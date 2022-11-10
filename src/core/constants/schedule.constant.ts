import { DropDownItem } from '@mth/components/DropDown/types'
import { ScheduleStatus } from '../enums/schedule-status.enums'

export const SCHEDULE_STATUS_OPTIONS: DropDownItem[] = [
  {
    label: 'Not Submitted',
    value: ScheduleStatus.NOT_SUBMITTED,
  },
  {
    label: 'Submitted',
    value: ScheduleStatus.SUBMITTED,
  },
  {
    label: 'Resubmitted',
    value: ScheduleStatus.RESUBMITTED,
  },
  {
    label: 'Updates Required',
    value: ScheduleStatus.UPDATES_REQUIRED,
  },
  {
    label: 'Updates Requested',
    value: ScheduleStatus.UPDATES_REQUESTED,
  },
  {
    label: 'Accepted',
    value: ScheduleStatus.ACCEPTED,
  },
]
