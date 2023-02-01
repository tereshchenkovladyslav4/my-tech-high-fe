import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { ReimbursementFormType } from '@mth/enums'

export const reimbursementRequestType = (type: ReimbursementFormType): string => {
  return REIMBURSEMENT_FORM_TYPE_ITEMS.find((x) => x.value === type)?.label?.toString() || type.toString()
}
