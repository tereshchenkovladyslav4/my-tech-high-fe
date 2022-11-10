import { DropDownItem } from '@mth/components/DropDown/types'
export type HeaderProps = {
  title: string
  selectedYear: number
  scheduleStatus: DropDownItem | undefined
  onSelectYear: (year: number) => void
  handleBack: () => void
}
