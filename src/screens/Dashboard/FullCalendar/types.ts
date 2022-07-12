import { MultiSelectDropDownListType } from '../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'

export type FullCalendarProps = {
  events: EventVM[]
  calendarEventList: CalendarEvent[]
  eventTypeLists: MultiSelectDropDownListType[]
  setEvents: (value: EventVM[]) => void
  setSectionName: (value: string) => void
}

export type EventDetailProps = {
  selectedEventIds: number[]
  events: EventVM[]
  setEvents: (value: EventVM[]) => void
  selectedEventIndex: number
  setSelectedEventIndex: (value: number) => void
}
