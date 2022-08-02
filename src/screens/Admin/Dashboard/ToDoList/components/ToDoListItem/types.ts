import { FunctionComponent } from 'react'

type TodoListItemProps = {
  todoItem: unknown
  idx: number
}

export type TodoListTemplateType = FunctionComponent<TodoListItemProps>
