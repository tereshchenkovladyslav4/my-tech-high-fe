import { FunctionComponent, ReactElement } from 'react'
import { SchoolYearType } from '../../../../../utils/utils.types'

export type StudentGradeProps = {
  student: unknown
  schoolYears: SchoolYearType[]
}

export type StudentGradeTemplateType = FunctionComponent<StudentGradeProps>

export type CircleData = {
  color?: string
  progress: number
  type: string
  icon?: ReactElement<unknown, string>
  mobileColor: string
  mobileText: string
}
