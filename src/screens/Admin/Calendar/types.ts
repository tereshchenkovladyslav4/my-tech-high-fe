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
}

export type EventVM = {
  title?: string
  type?: number
  startDate?: Date
  endDate?: Date
  time?: string
  description?: string
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
