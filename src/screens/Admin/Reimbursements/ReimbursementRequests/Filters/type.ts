import { SchoolYear } from '@mth/models'

export type FilterVM = {
  requests?: string[]
  types?: string[]
  others?: string[]
  statuses?: string[]
  grades?: string[]
}

export type FiltersProps = {
  schoolYearId: number
  schoolYear: SchoolYear | undefined
  setFilter: (_: FilterVM | undefined) => void
}
