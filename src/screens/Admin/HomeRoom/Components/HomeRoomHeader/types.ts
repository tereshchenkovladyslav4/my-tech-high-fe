import { DropDownItem } from '@mth/components/DropDown/types'

export type HomeRoomHeraderProps = {
  title: string
  selectedYear: number
  setSelectedYear: (value: number) => void
  schoolYearDropdownItems: DropDownItem[]
}
