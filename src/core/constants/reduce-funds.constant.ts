import { DropDownItem } from '@mth/components/DropDown/types'
import { ReduceFunds } from '@mth/enums'

export const REDUCE_FUNDS_ITEMS: DropDownItem[] = [
  { label: 'None', value: ReduceFunds.NONE },
  { label: 'Supplemental Learning Funds', value: ReduceFunds.SUPPLEMENTAL },
  { label: 'Technology Allowance', value: ReduceFunds.TECHNOLOGY },
]

export const ADMIN_REDUCE_FUNDS_ITEMS: DropDownItem[] = [
  { label: 'Disabled', value: ReduceFunds.NONE },
  { label: 'Supplemental Learning Funds', value: ReduceFunds.SUPPLEMENTAL },
  { label: 'Technology Allowance', value: ReduceFunds.TECHNOLOGY },
]
