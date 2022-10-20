import { DropDownItem } from '@mth/components/DropDown/types'

export type ScheduleType = {
  PeriodId?: number
  Text: string | null
  Period: string
  Subject: string
  Type: string
  Description: string
  PeriodDropdownItems?: DropDownItem[]
  NotifyPeriod?: boolean
  NotifyMessage?: string
}
