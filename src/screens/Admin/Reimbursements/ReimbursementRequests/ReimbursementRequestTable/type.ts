import { FilterVM } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/Filters/type'

export type ReimbursementRequestTableProps = {
  schoolYearId: number
  setSchoolYearId: (value: number) => void
  filter: FilterVM | undefined
}
