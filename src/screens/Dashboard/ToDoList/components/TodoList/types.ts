import { FunctionComponent } from 'react'
import { SchoolYearType } from '../../../HomeroomGrade/components/StudentGrade/types'

type TodoListProps = {
  handleShowEmpty: (isEmpty: boolean) => void
  schoolYears: SchoolYearType[]
}

export type TodoListTemplateType = FunctionComponent<TodoListProps>
