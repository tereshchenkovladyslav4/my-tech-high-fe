import { AssessmentType } from '../types'

export type AssessmentEditFormProps = {
  assessment: AssessmentType | undefined
  selectedYear: number
  availGrades: (string | number)[]
  refetch: () => void
}

export type OptionFormProps = {
  option: Option
  invalidation: boolean
  setOption: (value: Option) => void
  setIsChanged: (value: boolean) => void
}

export type Option = {
  index: number
  description: string
  optType: string
  requireReason: boolean
  reason: string
}
