import { FunctionComponent } from 'react'

type ToDoListItem = {
  id: number
  title: string
  link: string
  date: Date
  severity: number
  buttonTitle?: string
}

type TodoListItemProps = {
  todoItem: ToDoListItem
  idx: number
}

export type TodoListTemplateType = FunctionComponent<TodoListItemProps>
