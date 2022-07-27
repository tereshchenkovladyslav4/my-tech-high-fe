import { FunctionComponent, ReactNode } from 'react'
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

type CalendarDaysProps = {
  selectedEvent: EventVM | undefined
  eventList: CalendarEvent[]
  day: Date
  selectedDate: Date | undefined
  handleSelectedEvent: (value: CalendarEvent, date: Date) => void
  setSelectedDate: (value: Date | undefined) => void
}

type DashboardCalendarProps = {
  selectedEvent: EventVM | undefined
  calendarEventList: CalendarEvent[]
  selectedEventTypes: string[]
  selectedDate: Date | undefined
  setSelectedDate: (value: Date | undefined) => void
  eventTypeLists: MultiSelectDropDownListType[]
  handleSelectedEvent: (value: CalendarEvent, date: Date) => void
  setSelectedEventTypes: (value: string[]) => void
}

export type CalendarDaysTemplateType = FunctionComponent<CalendarDaysProps>
export type DashboardCalendarTemplateType = FunctionComponent<DashboardCalendarProps>
