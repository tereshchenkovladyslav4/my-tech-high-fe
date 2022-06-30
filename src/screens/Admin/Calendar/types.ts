export type EventType = {
  id: number
  name: string
  color: string
  priority: number
  archived: boolean
}

export type EventInvalidOption = {
  title: {
    status: boolean
    message: string
  }
  type: {
    status: boolean
    message: string
  }
  startDate: {
    status: boolean
    message: string
  }
  endDate: {
    status: boolean
    message: string
  }
  description: {
    status: boolean
    message: string
  }
  gradeFilter: {
    status: boolean
    message: string
  }
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

export type CalendarComponentProps = {
  eventList: CalendarEvent[]
  setEventList?: (value: CalendarEvent[] | undefined) => void
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
  time: string
  description: string
  filter_grades: string
  filter_other: string
  filter_program_year: string
  filter_provider: string
  filter_school_of_enrollment: string
  filter_users: string
}

export type EventComponentProps = {
  events: EventVM[]
  refetch: () => void
  setEvents: (value: EventVM[]) => void
  setEvent: (value: EventVM) => void
  selectedEventIndex: number
  setSelectedEventIndex: (value: number) => void
}

export type MainComponentProps = {
  setEvent: (value: EventVM | undefined) => void
  selectedEventIndex: number
  setSelectedEventIndex: (value: number) => void
}

export type AddEventComponentProps = {
  selectedEvent: EventVM | undefined
}

export type HeaderComponentProps = {
  title: string
  handleCancelClick: () => void
  setShowCancelModal: (value: boolean) => void
  handleSaveClick: () => void
}

export type EditEventComponentProps = {
  event: EventVM
  invalidOption: EventInvalidOption
  setEvent: (value: EventVM) => void
  setInvalidOption: (value: EventInvalidOption) => void
  setIsChanged: (value: boolean) => void
  handleAddRSVPClick: () => void
}
