import { ReduceFunds } from '@mth/enums'
import { Provider } from '@mth/screens/Homeroom/Schedule/types'

export const studentProviders: Provider[] = [
  {
    id: 5,
    name: 'TTA Direct Class',
    reduce_funds: ReduceFunds.TECHNOLOGY,
    reduce_funds_notification: '<p>Reduce Funds notification</p>\n',
    multiple_periods: false,
    multi_periods_notification: '<p>demo</p>\n',
    Periods: [
      {
        id: 25,
        period: 1,
        category: 'Homeroom',
      },
      {
        id: 27,
        period: 3,
        category: 'Language Arts',
      },
    ],
  },
  {
    id: 7,
    name: '*Free Tech Trep Academy Provided Curriculum',
    reduce_funds: ReduceFunds.SUPPLEMENTAL,
    reduce_funds_notification:
      '<p style="text-align:justify;">This deducts $100 from the student\'s Supplemental Learning Funds.</p>\n',
    multiple_periods: false,
    multi_periods_notification: '<p>Requires Multiple Periods</p>\n',
    Periods: [
      {
        id: 26,
        period: 2,
        category: 'Math',
      },
      {
        id: 27,
        period: 3,
        category: 'Language Arts',
      },
      {
        id: 28,
        period: 4,
        category: 'Social Studies',
      },
      {
        id: 29,
        period: 5,
        category: 'Science',
      },
      {
        id: 30,
        period: 6,
        category: 'Core',
      },
      {
        id: 31,
        period: 7,
        category: 'Optional Core',
      },
    ],
  },
  {
    id: 12,
    name: '*Tech Trep Academy Anchor class ',
    reduce_funds: ReduceFunds.NONE,
    reduce_funds_notification:
      '<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 18px;font-family: VisbyCF;">Reduce Funds Notification</span>&nbsp;</p>\n',
    multiple_periods: false,
    multi_periods_notification: '<p>This is testing here.</p>\n',
    Periods: [],
  },
  {
    id: 24,
    name: 'ALEKS Math',
    reduce_funds: ReduceFunds.NONE,
    reduce_funds_notification: '',
    multiple_periods: false,
    multi_periods_notification: '',
    Periods: [],
  },
  {
    id: 42,
    name: 'Homeroom',
    reduce_funds: ReduceFunds.NONE,
    reduce_funds_notification: '',
    multiple_periods: true,
    multi_periods_notification: '<p>This is Multiple Periods Notification.</p>\n',
    Periods: [
      {
        id: 25,
        period: 1,
        category: 'Homeroom',
      },
      {
        id: 27,
        period: 3,
        category: 'Language Arts',
      },
      {
        id: 28,
        period: 4,
        category: 'Social Studies',
      },
    ],
  },
  {
    id: 43,
    name: 'DreamLink',
    reduce_funds: ReduceFunds.NONE,
    reduce_funds_notification: '',
    multiple_periods: false,
    multi_periods_notification: '',
    Periods: [],
  },
  {
    id: 44,
    name: 'MTH Sample',
    reduce_funds: ReduceFunds.TECHNOLOGY,
    reduce_funds_notification:
      '<p style="margin-left:0px;">Provider <span style="color: rgb(14,14,14);font-size: 18px;font-family: VisbyCF;">Reduce Funds Notification</span></p>\n',
    multiple_periods: true,
    multi_periods_notification: '<p>This is demo Multiple Periods Notification.</p>\n',
    Periods: [
      {
        id: 25,
        period: 1,
        category: 'Homeroom',
      },
      {
        id: 26,
        period: 2,
        category: 'Math',
      },
    ],
  },
  {
    id: 60,
    name: 'Driving Professor',
    reduce_funds: ReduceFunds.SUPPLEMENTAL,
    reduce_funds_notification: '<p>Provider notifications for reduce funds.</p>\n',
    multiple_periods: false,
    multi_periods_notification: '',
    Periods: [],
  },
  {
    id: 65,
    name: 'Test Provider',
    reduce_funds: ReduceFunds.SUPPLEMENTAL,
    reduce_funds_notification: '<p>demo</p>\n',
    multiple_periods: true,
    multi_periods_notification: '',
    Periods: [
      {
        id: 26,
        period: 2,
        category: 'Math',
      },
      {
        id: 151,
        period: 5,
        category: 'Math',
      },
    ],
  },
  {
    id: 72,
    name: '1174Provider',
    reduce_funds: ReduceFunds.SUPPLEMENTAL,
    reduce_funds_notification: '<p>demo</p>\n',
    multiple_periods: false,
    multi_periods_notification: '',
    Periods: [],
  },
  {
    id: 79,
    name: 'Provider101',
    reduce_funds: ReduceFunds.TECHNOLOGY,
    reduce_funds_notification: '<p>Test notif for provider101</p>\n',
    multiple_periods: false,
    multi_periods_notification: '',
    Periods: [],
  },
  {
    id: 80,
    name: 'Test1',
    reduce_funds: ReduceFunds.SUPPLEMENTAL,
    reduce_funds_notification: '<p>Test1</p>\n',
    multiple_periods: true,
    multi_periods_notification: '',
    Periods: [
      {
        id: 201,
        period: 1,
        category: 'English',
      },
      {
        id: 230,
        period: 2,
        category: 'Test 123',
      },
    ],
  },
  {
    id: 94,
    name: '1429',
    reduce_funds: ReduceFunds.TECHNOLOGY,
    reduce_funds_notification:
      '<p>This is demo notif with <a href="http://google.com" target="_self">link</a>&nbsp;</p>\n',
    multiple_periods: true,
    multi_periods_notification:
      '<p>This is demo Multiple Periods Notification notif with <a href="http://google.com" target="_self">link</a>&nbsp;</p>\n',
    Periods: [
      {
        id: 30,
        period: 6,
        category: 'Core',
      },
      {
        id: 234,
        period: 4,
        category: '1429notif',
      },
    ],
  },
  {
    id: 109,
    name: 'Course A-Z Test',
    reduce_funds: ReduceFunds.TECHNOLOGY,
    reduce_funds_notification: '<p>12</p>\n',
    multiple_periods: false,
    multi_periods_notification: '',
    Periods: [],
  },
]
