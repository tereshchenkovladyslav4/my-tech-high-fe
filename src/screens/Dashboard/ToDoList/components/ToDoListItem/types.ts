import { FunctionComponent } from "react"

type TodoListItemProps =  {
	todoItem: any,
	idx: number,
	todoDate?: any
	todoDeadline?: any
}

export type TodoListTemplateType = FunctionComponent<TodoListItemProps>