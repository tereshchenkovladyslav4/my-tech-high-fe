import { ReduceFunds } from '../src/core/enums'
import { SchoolYear } from '../src/core/models'

export const schoolYear_SS: SchoolYear = {
  reimbursements: ReduceFunds.SUPPLEMENTAL,
  direct_orders: ReduceFunds.SUPPLEMENTAL,
}
export const schoolYear_SN: SchoolYear = {
  reimbursements: ReduceFunds.SUPPLEMENTAL,
  direct_orders: ReduceFunds.NONE,
}
export const schoolYear_TT: SchoolYear = {
  reimbursements: ReduceFunds.TECHNOLOGY,
  direct_orders: ReduceFunds.TECHNOLOGY,
}
export const schoolYear_TN: SchoolYear = {
  reimbursements: ReduceFunds.TECHNOLOGY,
  direct_orders: ReduceFunds.NONE,
}
export const schoolYear_NS: SchoolYear = {
  reimbursements: ReduceFunds.NONE,
  direct_orders: ReduceFunds.SUPPLEMENTAL,
}
export const schoolYear_NT: SchoolYear = {
  reimbursements: ReduceFunds.NONE,
  direct_orders: ReduceFunds.TECHNOLOGY,
}
export const schoolYear_NN: SchoolYear = {
  reimbursements: ReduceFunds.NONE,
  direct_orders: ReduceFunds.NONE,
}
