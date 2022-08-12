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
    label: 'Student Packet',
    value: 'Student Packet',
  },
  {
    label: 'Withdrawal Forms',
    value: 'Withdrawal Forms',
  },
  {
    label: 'Opt-out Forms',
    value: 'Opt-out Forms',
  },
  {
    label: 'USIRS',
    value: 'USIRS',
  },
]
