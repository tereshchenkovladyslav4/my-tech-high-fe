export type CourseCatalogHeaderProps = {
  title: string
  selectedYear: number
  setSelectedYear: (value: number) => void
  showArchived: boolean
  setShowArchived: (value: boolean) => void
  searchField: string
  setSearchField: (value: string) => void
}
