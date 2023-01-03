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
