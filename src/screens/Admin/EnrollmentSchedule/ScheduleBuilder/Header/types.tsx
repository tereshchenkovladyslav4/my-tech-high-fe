import { DropDownItem } from '@mth/components/DropDown/types'
export type HeaderProps = {
  title: string
  schoolYearItems: DropDownItem[]
  selectedYearId: number | undefined
  scheduleStatus: DropDownItem | undefined
  setSelectedYearId: (value: number) => void
  handleBack: () => void
  viewonly: boolean
}
