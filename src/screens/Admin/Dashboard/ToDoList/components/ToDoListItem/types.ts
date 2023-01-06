type ToDoListItem = {
  id: number
  title: string
  link: string
  date: Date
  severity: number
  buttonTitle?: string
}

export type TodoListItemProps = {
  todoItem: ToDoListItem
  idx: number
}
