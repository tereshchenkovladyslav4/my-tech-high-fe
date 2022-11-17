import { FunctionComponent, ReactElement } from 'react'
import { SchoolYearType } from '@mth/models'
import { ToDoItem } from '@mth/screens/Dashboard/ToDoList/components/ToDoListItem/types'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'

export type StudentGradeProps = {
  student: StudentType
  schoolYears: SchoolYearType[]
  notification: ToDoItem
}

export type StudentGradeTemplateType = FunctionComponent<StudentGradeProps>

export type CircleData = {
  color?: string
  progress: number
  type?: string
  icon?: ReactElement<unknown, string>
  mobileColor?: string
  mobileText?: string
  message?: string
}
