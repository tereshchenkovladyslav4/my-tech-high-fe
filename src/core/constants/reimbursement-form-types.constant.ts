import { DropDownItem } from '@mth/components/DropDown/types'
import { ReimbursementFormType } from '@mth/enums'

export const REIMBURSEMENT_FORM_TYPE_ITEMS: DropDownItem[] = [
  { label: 'Custom-built', value: ReimbursementFormType.CUSTOM_BUILT.toString() },
  { label: 'Technology Allowance', value: ReimbursementFormType.TECHNOLOGY.toString() },
  { label: '3rd Party Provider', value: ReimbursementFormType.THIRD_PARTY_PROVIDER.toString() },
  { label: 'Supplemental Learning Funds', value: ReimbursementFormType.SUPPLEMENTAL.toString() },
  { label: 'Require Software', value: ReimbursementFormType.REQUIRED_SOFTWARE.toString() },
]
