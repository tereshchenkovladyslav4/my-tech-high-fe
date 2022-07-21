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
}

export type CalendarEvent = {
  id: number
  title: string
  start: Date
  end: Date
  color: string
  backgroundColor: string
  allDay?: boolean
}

export type EventCalendarProps = {
  eventList: CalendarEvent[]
  selectedDate: Date | undefined
  selectedEvent: EventVM | undefined
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
}

export type EventDetailProps = {
  selectedEvent: EventVM | undefined
  events: EventVM[]
  selectedEventId: number
  selectedDate: Date | undefined
  selectedEventIndex: number
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
}

export type EventFormProps = {
  setIsChanged: (value: boolean) => void
  handleAddRSVPClick: () => void
}

export type FilterComponentProps = {
  grades: string[]
  programYears: string[]
  users: string[]
  schoolofEnrollments: string[]
  others: string[]
  providers: string[]
  setGrades: (value: string[]) => void
  setProgramYears: (value: string[]) => void
  setUsers: (value: string[]) => void
  setSchoolofEnrollment: (value: string[]) => void
  setOthers: (value: string[]) => void
  setProviders: (value: string[]) => void
  setIsChanged: (value: boolean) => void
}

export type EventTypeTableProps = {
  eventTypes: EventType[]
  handleEditClick: (value: EventType) => void
  setSelectedEventType: (value: EventType) => void
  setShowArchivedModal: (value: boolean) => void
  setShowUnarchivedModal: (value: boolean) => void
  handleUpdateEventTypes: (value: EventType[]) => void
  setEventTypes: (value: EventType[]) => void
}
