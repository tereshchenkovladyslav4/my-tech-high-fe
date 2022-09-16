import { MultiSelectDropDownListType } from '../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'
import { DashboardSection } from '../types'

export type ParentEventDetailProps = {
  selectedEvent: EventVM | undefined
  setSectionName: (value: DashboardSection) => void
  handleRSVPClick: () => void
  handlePrevEventView: () => void
  handleNextEventView: () => void
}

export type ParentCalendarProps = {
  events: EventVM[]
  calendarEventList: CalendarEvent[]
  eventTypeLists: MultiSelectDropDownListType[]
  sectionName?: DashboardSection
  setSectionName: (value: DashboardSection) => void
}
