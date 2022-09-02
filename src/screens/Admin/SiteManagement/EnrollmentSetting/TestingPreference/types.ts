import { DropDownItem } from '@mth/components/DropDown/types'

export type HeaderComponentProps = {
  dropDownItems: DropDownItem[]
  selectedSchoolYear: number
  setSelectedSchoolYear: (value: number) => void
}

export type TestingPreferenceInformationProps = {
  title: string
  description: string
}

export type AssessmentType = {
  id: number
  title: string
  value: string
  isArchived: boolean
}

export type AssessmentTableProps = {
  assessmentItems: AssessmentType[]
  setAssessmentItems: (value: AssessmentType[]) => void
}

export type AssessmentItemProps = {
  item: AssessmentType
  index: number
  setIsDragDisable: (value: boolean) => void
}
