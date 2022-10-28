import { DropDownItem } from '@mth/components/DropDown/types'
export type HeaderProps = {
  title: string
  schoolYearItems: DropDownItem[]
  selectedYear: number
  scheduleStatus: DropDownItem | undefined
  onSelectYear: (year: number) => void
  handleBack: () => void
}
