import { SchoolYear } from '@mth/models'
import { FilterVM } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/Filters/type'

export type ReimbursementRequestTableProps = {
  schoolYearId: number
  setSchoolYearId: (value: number) => void
  setSchoolYear: (value: SchoolYear | undefined) => void
  filter: FilterVM | undefined
}
