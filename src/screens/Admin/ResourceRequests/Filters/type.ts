import { SchoolYear } from '@mth/models'

export type FilterVM = {
  studentStatuses?: string[]
  statuses?: string[]
  relations?: string[]
  features?: string[]
  types?: string[]
  resources?: string[]
  courses?: string[]
}

export type FiltersProps = {
  schoolYearId: number
  schoolYear: SchoolYear | undefined
  setFilter: (_: FilterVM | undefined) => void
}
