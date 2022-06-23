import moment from 'moment'
import { EventInvalidOption, EventVM } from './types'

export const defaultEvent: EventVM = {
  title: '',
  eventTypeId: 0,
  startDate: new Date(),
  endDate: new Date(),
  time: moment(new Date()).format('HH:mm'),
  eventId: 0,
  eventTypeColor: '',
  eventTypeName: '',
  description: '',
  filters: {
    grades: '',
    other: '',
    programYear: '',
    provider: '',
    schoolOfEnrollment: '',
    users: '',
  },
}

export const defaultInvalidOption: EventInvalidOption = {
  title: {
    status: false,
    message: '',
  },
  type: {
    status: false,
    message: '',
  },
  startDate: {
    status: false,
    message: '',
  },
  endDate: {
    status: false,
    message: '',
  },
  description: {
    status: false,
    message: '',
  },
  gradeFilter: {
    status: false,
    message: '',
  },
}
