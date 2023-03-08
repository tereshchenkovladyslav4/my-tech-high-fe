import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTitle, ReduceFunds } from '@mth/enums'

export const REDUCE_FUNDS_ITEMS: DropDownItem[] = [
  { label: 'None', value: ReduceFunds.NONE },
  { label: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS, value: ReduceFunds.SUPPLEMENTAL },
  { label: MthTitle.TECHNOLOGY_ALLOWANCE, value: ReduceFunds.TECHNOLOGY },
]

export const ADMIN_REDUCE_FUNDS_ITEMS: DropDownItem[] = [
  { label: 'Disabled', value: ReduceFunds.NONE },
  { label: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS, value: ReduceFunds.SUPPLEMENTAL },
  { label: MthTitle.TECHNOLOGY_ALLOWANCE, value: ReduceFunds.TECHNOLOGY },
]
