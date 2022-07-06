import { CheckBoxListVM } from './components/CheckBoxList/CheckBoxList'
import { EventInvalidOption, EventVM } from './types'

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

export const defaultUserList: CheckBoxListVM[] = [
  {
    label: 'Parents/Observers',
    value: 'parent/observers',
  },
  {
    label: 'Students',
    value: 'students',
  },
  {
    label: 'Teachers & Assistants',
    value: 'teacher&assistants',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
]

export const defaultOtherList: CheckBoxListVM[] = [
  {
    label: 'Diploma Seeking',
    value: 'diploma-seeking',
  },
  {
    label: 'Non-diploma Seeking',
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
