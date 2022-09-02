import { MultiSelectDropDownListType } from '../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'

export type ParentEventDetailProps = {
  selectedEvent: EventVM | undefined
  setSectionName: (value: string) => void
  handleRSVPClick: () => void
  handlePrevEventView: () => void
  handleNextEventView: () => void
}

export type ParentCalendarProps = {
  events: EventVM[]
  calendarEventList: CalendarEvent[]
  eventTypeLists: MultiSelectDropDownListType[]
  setSectionName: (value: string) => void
}
