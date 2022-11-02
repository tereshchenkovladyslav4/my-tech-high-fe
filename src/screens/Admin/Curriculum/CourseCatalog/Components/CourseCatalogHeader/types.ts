import { SchoolYearResponseType } from '@mth/hooks'

export type CourseCatalogHeaderProps = {
  title: string
  selectedYear: number
  setSelectedYear: (value: number) => void
  setSelectedYearData?: (value?: SchoolYearResponseType) => void
  showArchived: boolean
  setShowArchived: (value: boolean) => void
  setSearchField: (value: string) => void
}
