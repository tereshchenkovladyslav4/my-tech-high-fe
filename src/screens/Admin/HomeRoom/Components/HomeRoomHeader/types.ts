import { SchoolYearResponseType } from '@mth/hooks'

export type HomeRoomHeraderProps = {
  title: string
  selectedYear: number
  setSelectedYear: (value: number) => void
  setSelectedYearData?: (value?: SchoolYearResponseType) => void
}
