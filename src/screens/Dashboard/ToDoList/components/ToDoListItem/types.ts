import { FunctionComponent } from 'react'

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
}

export interface ToDoItem {
  category: ToDoCategory
  phrase: string
  button: string
  icon: string
  dashboard: number
  homeroom: number
  students: unknown[]
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
