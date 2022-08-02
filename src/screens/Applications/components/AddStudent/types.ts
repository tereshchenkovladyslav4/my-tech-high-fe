import { FunctionComponent } from 'react'

export type AddStudentProps = {
  idx: number
  onFieldChange: unknown
  handleRemoveStudent?: unknown
  yearLabel?: string
}
export type AddStudentTemplate = FunctionComponent<AddStudentProps>
