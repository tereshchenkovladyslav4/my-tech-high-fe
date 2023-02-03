import { CheckBoxListVM } from '@mth/components/MthCheckBoxList/MthCheckboxList'
import { StudentRecordFileKind } from '@mth/enums'

export const DEFULAT_PROGRAM_YEAR_STATUS_LIST: CheckBoxListVM[] = [
  {
    label: 'New',
    value: 'New',
  },
  {
    label: 'Returning',
    value: 'Returning',
  },
  {
    label: 'Transferred',
    value: 'Transferred',
  },
]

export const DEFULAT_ENROLLMENT_STATUS_LIST: CheckBoxListVM[] = [
  {
    label: 'Pending',
    value: 'Pending',
  },
  {
    label: 'Active',
    value: 'Active',
  },
  {
    label: 'Withdrawn',
    value: 'Withdrawn',
  },
]

export const DEFAULT_ENROLLMENT_STATUS_FILTER = ['Pending', 'Active']
export const DEFULAT_PROGRAM_YEAR_STATUS_FILTER = ['New', 'Returning', 'Transferred']
export const DEFAULT_GRADES_FILTER1 = [
  'Kindergarten',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'all',
]
export const DEFAULT_GRADES_FILTER2 = ['Kindergarten', '1-8', '9-12']

export const DEFAULT_SPECIAL_ED_LIST: CheckBoxListVM[] = [
  {
    label: 'IEP',
    value: 'IEP',
  },
  {
    label: '504',
    value: '504',
  },
  {
    label: 'None',
    value: 'None',
  },
]

export const DEFAULT_OTHER_LIST: CheckBoxListVM[] = [
  {
    label: StudentRecordFileKind.STUDENT_PACKET,
    value: StudentRecordFileKind.STUDENT_PACKET,
  },
  {
    label: StudentRecordFileKind.WITHDRAWAL_FORM,
    value: StudentRecordFileKind.WITHDRAWAL_FORM,
  },
  {
    label: StudentRecordFileKind.OPT_OUT_FORM,
    value: StudentRecordFileKind.OPT_OUT_FORM,
  },
  {
    label: StudentRecordFileKind.USIRS,
    value: StudentRecordFileKind.USIRS,
  },
  {
    label: StudentRecordFileKind.SCHEDULE,
    value: StudentRecordFileKind.SCHEDULE,
  },
  {
    label: StudentRecordFileKind.WEEKLY_LEARNING_LOG,
    value: StudentRecordFileKind.WEEKLY_LEARNING_LOG,
  },
]
