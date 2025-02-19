import { ReactNode } from 'react'
import { MultiSelectDropDownListType } from '../../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { CalendarEvent, EventVM } from '../../../Admin/Calendar/types'

export type DayVM = {
  currentMonth: boolean
  date: Date
  month: number
  number: number
  selected: boolean
  year: number
  eventElement: ReactNode
  eventCount: number
  eventColor?: string
}

export type CalendarDaysProps = {
  selectedEvent: EventVM | undefined
  eventList: CalendarEvent[]
  currentMonth: Date
  selectedDate: Date | undefined
  handleSelectedEvent: (value: CalendarEvent, date: Date) => void
  setSelectedDate: (value: Date | undefined) => void
}

export type DashboardCalendarProps = {
  currentMonth: Date
  selectedEvent: EventVM | undefined
  calendarEventList: CalendarEvent[]
  selectedEventTypes: string[]
  selectedDate: Date | undefined
  eventTypeLists: MultiSelectDropDownListType[]
  setCurrentMonth: (value: Date) => void
  setSelectedDate: (value: Date | undefined) => void
  handleSelectedEvent: (value: CalendarEvent, date: Date) => void
  setSelectedEventTypes: (value: string[]) => void
}
