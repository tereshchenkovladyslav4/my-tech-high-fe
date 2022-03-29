import { FunctionComponent } from "react"

type TodoListItemProps =  {
	todoItem: any,
	idx: number
}

export type TodoListTemplateType = FunctionComponent<TodoListItemProps>