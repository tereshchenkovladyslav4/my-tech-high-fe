import { ReactElement } from 'react'
import { SchoolYear, Student } from '@mth/models'
import { ToDoItem } from '@mth/screens/Dashboard/ToDoList/components/ToDoListItem/types'

export type StudentGradeProps = {
  student: Student
  schoolYears: SchoolYear[]
  notifications: ToDoItem[]
}

export type CircleData = {
  color?: string
  progress: number
  type?: string
  icon?: ReactElement<unknown, string>
  mobileColor?: string
  mobileText?: string
  message?: string
}
