import { FunctionComponent } from 'react'

export type AddStudentProps = {
  idx: number
  onFieldChange: any
  handleRemoveStudent?: any
  yearLabel?: string
}
export type AddStudentTemplate = FunctionComponent<AddStudentProps>
