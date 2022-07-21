import { FunctionComponent } from 'react'
import { MultiSelectDropDownListType } from '../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'

type ParentEventDetailProps = {
  selectedEvent: EventVM | undefined
  setSectionName: (value: string) => void
  handleRSVPClick: () => void
  handlePrevEventView: () => void
  handleNextEventView: () => void
}

type ParentCalendarProps = {
  events: EventVM[]
  calendarEventList: CalendarEvent[]
  eventTypeLists: MultiSelectDropDownListType[]
  setSectionName: (value: string) => void
}

export type ParentEventDetailTemplateType = FunctionComponent<ParentEventDetailProps>
export type ParentCalendarTemplateType = FunctionComponent<ParentCalendarProps>
