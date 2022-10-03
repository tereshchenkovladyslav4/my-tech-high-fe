import { ReactNode } from 'react'

export enum SEMESTER_TYPE {
  NONE = 'NONE',
  PERIOD = 'PERIOD',
  SUBJECT = 'SUBJECT',
}
export const SEMESTER_MESSAGE = {
  [SEMESTER_TYPE.NONE]: 'None',
  [SEMESTER_TYPE.PERIOD]: 'Unlock this Period',
  [SEMESTER_TYPE.SUBJECT]: 'Only unlock Subjects mapped to this Period',
}

export enum REDUCE_FUNDS_TYPE {
  NONE = 'NONE',
  SUPPLEMENTAL = 'SUPPLEMENTAL',
  TECHNOLOGY = 'TECHNOLOGY',
}

export type OptionType = {
  value: string | number
  label: string | number
}

export type CurriculumItem = {
  id: number
  icon?: string | ReactNode
  title: string
  subtitle: string
  img: string
  link: string
  action?: boolean
  disabled?: boolean
}

export type PeriodItem = {
  id?: number
  period: number
  category: string
  semester: SEMESTER_TYPE
  grade_level_min: string
  grade_level_max: string
  message_period?: string
  message_semester?: string
  reduce_funds?: REDUCE_FUNDS_TYPE
  price?: string | number
  archived?: boolean
  notify_semester: boolean
  notify_period: boolean
}

export type StateCodeType = {
  id?: number
  title_id: string | number
  title: string
  grade: string
  teacher_id?: number
  teacher_name: string
  state_code: string | number
  subject: string
}
