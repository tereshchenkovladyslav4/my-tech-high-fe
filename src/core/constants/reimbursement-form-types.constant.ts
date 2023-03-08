import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTitle, ReimbursementFormType } from '@mth/enums'

export const REIMBURSEMENT_FORM_TYPE_ITEMS: DropDownItem[] = [
  { label: MthTitle.CUSTOM_BUILT, value: ReimbursementFormType.CUSTOM_BUILT.toString() },
  { label: MthTitle.TECHNOLOGY_ALLOWANCE, value: ReimbursementFormType.TECHNOLOGY.toString() },
  { label: MthTitle.THIRD_PARTY_PROVIDER, value: ReimbursementFormType.THIRD_PARTY_PROVIDER.toString() },
  { label: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS, value: ReimbursementFormType.SUPPLEMENTAL.toString() },
  { label: MthTitle.REQUIRED_SOFTWARE, value: ReimbursementFormType.REQUIRED_SOFTWARE.toString() },
]
