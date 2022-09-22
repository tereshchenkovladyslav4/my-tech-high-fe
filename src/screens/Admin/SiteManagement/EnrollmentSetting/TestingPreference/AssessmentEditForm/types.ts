import { AssessmentOptionType, AssessmentType } from '../types'

export type AssessmentEditFormProps = {
  assessment: AssessmentType | undefined
  selectedYear: number
  availGrades: (string | number)[]
  refetch: () => void
}

export type OptionFormProps = {
  option: AssessmentOptionType | undefined
  invalidation: boolean
  setOption: (value: AssessmentOptionType) => void
  setIsChanged: (value: boolean) => void
}
