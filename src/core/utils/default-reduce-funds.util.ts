import { ReduceFunds } from '@mth/enums'
import { SchoolYear } from '@mth/models'

export const defaultReduceFunds = (schoolYearData?: SchoolYear): ReduceFunds | null => {
  if (!schoolYearData) return null
  return (
    (schoolYearData.reimbursements != ReduceFunds.NONE && schoolYearData.reimbursements) ||
    (schoolYearData.direct_orders != ReduceFunds.NONE && schoolYearData.direct_orders) ||
    null
  )
}
