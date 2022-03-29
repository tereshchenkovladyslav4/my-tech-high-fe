import { FunctionComponent, ReactElement } from 'react'

export type StudentGradeProps = {
  student: any
}

export type StudentGradeTemplateType = FunctionComponent<StudentGradeProps>

export type CircleData = {
  color?: string,
  progress: number,
  message: string,
  icon?: ReactElement<any, any>
}
