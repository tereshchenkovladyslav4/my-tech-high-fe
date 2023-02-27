import { CheckBoxListVM } from '@mth/components/MthCheckBoxList/types'
import { EventFormData, EventVM } from './types'

export const defaultEvent: EventVM = {
  title: '',
  eventTypeId: 0,
  startDate: new Date(),
  endDate: new Date(),
  time: '00:00',
  eventId: 0,
  allDay: true,
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
  hasRSVP: false,
}

export const defaultEventFormData: EventFormData = {
  title: '',
  eventTypeId: 0,
  startDate: new Date(),
  endDate: new Date(),
  time: '00:00',
  allDay: true,
  description: '',
  grades: [],
  hasRSVP: false,
  users: [],
}

export const defaultUserList: CheckBoxListVM[] = [
  {
    label: 'Parents/Observers',
    value: '1',
  },
  {
    label: 'Students',
    value: '2',
  },
  {
    label: 'Teachers & Assistants',
    value: '3',
  },
  {
    label: 'Admin',
    value: '0',
  },
]

export const defaultOtherList: CheckBoxListVM[] = [
  {
    label: 'Diploma-seeking',
    value: 'diploma-seeking',
  },
  {
    label: 'Non Diploma-seeking',
    value: 'non-diploma-seeking',
  },
  {
    label: 'Testing Opt-in',
    value: 'testing-opt-in',
  },
  {
    label: 'Testing Opt-out',
    value: 'testing-opt-out',
  },
]

export const defaultProviderList: CheckBoxListVM[] = [
  {
    label: 'CfA',
    value: 'cfa',
  },
  {
    label: 'Snow College',
    value: 'snow-college',
  },
  {
    label: 'Alex Math',
    value: 'alex-math',
  },
  {
    label: 'MTH Direct',
    value: 'mth-direct',
  },
]
