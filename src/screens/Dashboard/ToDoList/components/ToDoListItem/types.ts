import { FunctionComponent } from 'react'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'

export enum ToDoCategory {
  SUBMIT_ENROLLMENT_PACKET = 'SUBMIT_ENROLLMENT_PACKET',
  RESUBMIT_ENROLLMENT_PACKET = 'RESUBMIT_ENROLLMENT_PACKET',
  SUBMIT_SCHEDULE = 'SUBMIT_SCHEDULE',
  RESUBMIT_SCHEDULE = 'RESUBMIT_SCHEDULE',
  RESUBMIT_REIMBURSEMENT = 'RESUBMIT_REIMBURSEMENT',
  RESUBMIT_DIRECT_ORDER = 'RESUBMIT_DIRECT_ORDER',
  TESTING_PREFERNCE = 'TESTING_PREFERNCE',
  MISSING_LEARNING_LOG = 'MISSING_LEARNING_LOG',
  RESUBMIT_LEARNING_LOG = 'RESUBMIT_LEARNING_LOG',
  INTENT_TO_RE_ENROLL = 'INTENT_TO_RE_ENROLL',
  REQUEST_HOMEROOM_RESOURCES = 'REQUEST_HOMEROOM_RESOURCES',
  SUBMIT_WITHDRAW = 'SUBMIT_WITHDRAW',
  SUBMIT_SECOND_SEMESTER_SCHEDULE = 'SUBMIT_SECOND_SEMESTER_SCHEDULE',
  RESUBMIT_SECOND_SEMESTER_SCHEDULE = 'RESUBMIT_SECOND_SEMESTER_SCHEDULE',
}

export interface ToDoItem {
  category: ToDoCategory
  phrase: string
  button: string
  students: StudentType[]
  icon: string
  dashboard: number
  homeroom: number
  date_accepted?: string
  date_deadline?: number
  parsed?: unknown
}

type TodoListItemProps = {
  todoItem: ToDoItem
  idx: number
  todoDate?: unknown
  todoDeadline?: unknown
}

export type TodoListTemplateType = FunctionComponent<TodoListItemProps>
