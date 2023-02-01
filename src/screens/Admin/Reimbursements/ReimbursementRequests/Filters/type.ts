export type FilterVM = {
  requests?: string[]
  types?: string[]
  others?: string[]
  statuses?: string[]
  grades?: string[]
}

export type FiltersProps = {
  schoolYearId: number
  setFilter: (_: FilterVM | undefined) => void
}
