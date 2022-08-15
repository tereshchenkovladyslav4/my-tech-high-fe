import { StudentRecordFileKind } from '@mth/enums'
import { CheckBoxListVM } from '../Calendar/components/CheckBoxList/CheckBoxList'

export const defaultStatusOptions: CheckBoxListVM[] = [
  {
    label: 'New',
    value: 'New',
  },
  {
    label: 'Returning',
    value: 'Returning',
  },
  {
    label: 'Withdrawn',
    value: 'Withdrawn',
  },
]

export const defaultSpecialEdOptions: CheckBoxListVM[] = [
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

export const defaultOtherOptions: CheckBoxListVM[] = [
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
]
