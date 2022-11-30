import { SchoolYear } from '@mth/models'

export type CourseCatalogHeaderProps = {
  title: string
  selectedYear: number
  setSelectedYear: (value: number) => void
  setSelectedYearData?: (value?: SchoolYear) => void
  showArchived: boolean
  setShowArchived: (value: boolean) => void
  setSearchField: (value: string) => void
}
