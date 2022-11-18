export type EventType = {
  id: number
  name: string
  color: string
  priority: number
  archived: boolean
}

export type EventVM = {
  eventId?: number
  title: string
  eventTypeId: number
  eventTypeColor: string
  eventTypeName: string
  startDate: Date
  endDate: Date
  time: string
  description: string
  allDay: boolean
  filters: {
    grades: string
    other: string
    programYear: string
    provider: string
    schoolOfEnrollment: string
    users: string
  }
  hasRSVP: boolean
}

export type CalendarEvent = {
  id: number
  title: string
  start: Date
  end: Date
  color: string
  backgroundColor: string
  allDay?: boolean
  hasRSVP?: boolean
}

export type EventCalendarProps = {
  eventList: CalendarEvent[]
  selectedDate: Date | undefined
  selectedEvent: EventVM | undefined
  currentMonth: Date
  setCurrentMonth: (value: Date) => void
  setSelectedEventId: (value: number) => void
  setEventList?: (value: CalendarEvent[] | undefined) => void
  setSelectedDate: (value: Date | undefined) => void
}

export type EventTypeResponseVM = {
  event_type_id?: number
  name?: string
  color?: string
  priority?: number
  RegionId?: number
  archived?: boolean
  created_at?: string
  updated_at?: string
}

export type EventResponseVM = {
  event_id: number
  title: string
  TypeId: number
  EventType: EventTypeResponseVM
  start_date: Date
  end_date: Date
  all_day: boolean
  time: string
  description: string
  filter_grades: string
  filter_other: string
  filter_program_year: string
  filter_provider: string
  filter_school_of_enrollment: string
  filter_users: string
  position: number
  startDateOnly: Date
  endDateOnly: Date
  has_rsvp: boolean
}

export type EventDetailProps = {
  selectedEvent: EventVM | undefined
  events: EventVM[]
  selectedEventId: number
  selectedDate: Date | undefined
  selectedEventIndex: number
  currentMonth: Date
  refetch: () => void
  setEvent: (value: EventVM) => void
  setSelectedEvent: (value: EventVM | undefined) => void
  setSelectedEventIndex: (value: number) => void
}

export type MainComponentProps = {
  setEvent: (value: EventVM | undefined) => void
  selectedEventIndex: number
  setSelectedEventIndex: (value: number) => void
}

export type AddEventProps = {
  selectedEvent: EventVM | undefined
}

export type HeaderComponentProps = {
  title: string
  handleCancelClick: () => void
  setShowCancelModal: (value: boolean) => void
}

export interface EventFormData {
  title: string
  eventTypeId: number
  startDate: Date
  endDate: Date
  time: string
  allDay: boolean
  description: string
  grades: string[]
  hasRSVP: boolean
  users: string[]
  programYears: string[]
  schoolOfEnrollments: string[]
}

export type EventFormProps = {
  setIsChanged: (value: boolean) => void
  handleAddRSVPClick: () => void
}

export type FilterComponentProps = {
  others: string[]
  providers: string[]
  setOthers: (value: string[]) => void
  setProviders: (value: string[]) => void
  setIsChanged: (value: boolean) => void
  isNew?: boolean
}

export type EventTypeTableProps = {
  eventTypes: EventType[]
  setIsChanged: (value: boolean) => void
  handleEditClick: (value: EventType) => void
  setSelectedEventType: (value: EventType) => void
  setShowArchivedModal: (value: boolean) => void
  setShowUnarchivedModal: (value: boolean) => void
  handleUpdateEventTypes: (value: EventType[]) => void
}
