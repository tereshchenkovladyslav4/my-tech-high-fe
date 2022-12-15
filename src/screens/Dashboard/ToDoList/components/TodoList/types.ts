import { SchoolYear } from '@mth/models'
import { ToDoItem } from '../ToDoListItem/types'

export type TodoListProps = {
  handleShowEmpty: (isEmpty: boolean) => void
  schoolYears: SchoolYear[]
  setIsLoading?: (isLoading: boolean) => void
  setMainTodoList?: (todoList: ToDoItem[]) => void
}
