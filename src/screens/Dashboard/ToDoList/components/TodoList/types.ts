import { FunctionComponent } from 'react'
import { SchoolYearType } from '../../../../../utils/utils.types'
import { ToDoItem } from '../ToDoListItem/types'

type TodoListProps = {
  handleShowEmpty: (isEmpty: boolean) => void
  schoolYears: SchoolYearType[]
  setIsLoading?: (isLoading: boolean) => void
  setMainTodoList?: (todoList: ToDoItem[]) => void
}

export type TodoListTemplateType = FunctionComponent<TodoListProps>
