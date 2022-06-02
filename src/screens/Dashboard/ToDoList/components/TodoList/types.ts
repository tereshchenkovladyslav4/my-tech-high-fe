import { FunctionComponent } from "react"

type TodoListProps =  {
	handleShowEmpty: (isEmpty: boolean) => void;
}

export type TodoListTemplateType = FunctionComponent<TodoListProps>