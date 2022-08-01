import { FunctionComponent } from 'react'
import { MultiSelectDropDownListType } from '../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'

export type FullCalendarProps = {
  searchField: string
  events: EventVM[]
  calendarEventList: CalendarEvent[]
  eventTypeLists: MultiSelectDropDownListType[]
  setSearchField: (value: string) => void
  setSectionName: (value: string) => void
}

export type EventDetailProps = {
  selectedDate: Date | undefined
  selectedEventId: number
  events: EventVM[]
  selectedEventIndex: number
  selectedEvent: EventVM | undefined
  currentMonth: Date
  setSelectedEvent: (value: EventVM | undefined) => void
  setSelectedEventIndex: (value: number) => void
}

type HeaderComponentProps = {
  searchField: string
  eventTypeLists: MultiSelectDropDownListType[]
  selectedEventTypes: string[]
  setSelectedEventTypes: (value: string[]) => void
  setSearchField: (value: string) => void
  setSectionName: (value: string) => void
}

export type HeaderTemplateType = FunctionComponent<HeaderComponentProps>
