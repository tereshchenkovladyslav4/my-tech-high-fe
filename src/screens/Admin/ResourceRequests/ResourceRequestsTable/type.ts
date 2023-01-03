import { SchoolYear } from '@mth/models'
import { FilterVM } from '@mth/screens/Admin/ResourceRequests/Filters/type'

export type ResourceRequestsTableProps = {
  schoolYearId: number
  setSchoolYearId: (value: number) => void

  schoolYear: SchoolYear | undefined
  setSchoolYear: (value: SchoolYear | undefined) => void
  filter: FilterVM | undefined
}
