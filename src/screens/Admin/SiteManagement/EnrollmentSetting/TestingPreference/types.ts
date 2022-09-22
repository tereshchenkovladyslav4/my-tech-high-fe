import { DropDownItem } from '@mth/components/DropDown/types'

export type HeaderComponentProps = {
  dropDownItems: DropDownItem[]
  selectedSchoolYear: number
  setSelectedSchoolYear: (value: number) => void
}

export type Information = {
  schoolYear?: number
  type?: string
  title: string
  description: string
}

export type TestingPreferenceInformationProps = {
  information: Information
  editable?: boolean
  refetch?: () => void
}

export type AssessmentOptionType = {
  index?: number
  option_id?: number
  AssessmentId?: number
  label: string
  method: string
  require_reason: boolean
  reason: string
}

export type AssessmentType = {
  assessment_id: number
  SchoolYearId?: number
  test_name: string
  grades: string
  information: string
  priority: number
  is_archived: boolean
  Options: AssessmentOptionType[]
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
  refetch?: () => void
  handleClose: () => void
}
