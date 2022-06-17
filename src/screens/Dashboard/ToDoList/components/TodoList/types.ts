import { FunctionComponent } from 'react'
import { SchoolYearType } from '../../../../../utils/utils.types'

type TodoListProps = {
  handleShowEmpty: (isEmpty: boolean) => void
  schoolYears: SchoolYearType[]
}

export type TodoListTemplateType = FunctionComponent<TodoListProps>
