import { DropDownItem } from '@mth/components/DropDown/types'

export type HeaderComponentProps = {
  dropDownItems: DropDownItem[]
  selectedSchoolYear: number
  setSelectedSchoolYear: (value: number) => void
}

export type Information = {
  schoolYear: number
  type: string
  title: string
  description: string
}

export type TestingPreferenceInformationProps = {
  information: Information
  refetch: () => void
}

export type AssessmentType = {
  assessment_id: number
  SchoolYearId?: number
  test_name: string
  grades: string
  information: string
  priority: number
  is_archived: boolean
  option1: string
  option_list?: string
}

export type AssessmentTableProps = {
  assessmentItems: AssessmentType[]
  refetch: () => void
  setSelectedAssessment: (value: AssessmentType) => void
  setAssessmentItems: (value: AssessmentType[]) => void
}

export type AssessmentItemProps = {
  item: AssessmentType
  index: number
  refetch: () => void
  setSelectedAssessment: (value: AssessmentType) => void
  setIsDragDisable: (value: boolean) => void
}

export type CustomizableDetailModalProps = {
  information: Information
  refetch: () => void
  handleClose: () => void
}
