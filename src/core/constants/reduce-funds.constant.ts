import { DropDownItem } from '@mth/components/DropDown/types'
import { ReduceFunds } from '@mth/enums'

export const REDUCE_FUNDS_ITEMS: DropDownItem[] = [
  { label: 'None', value: ReduceFunds.NONE },
  { label: 'Technology Allowance', value: ReduceFunds.TECHNOLOGY_ALLOWANCE },
  { label: 'Supplemental Learning Funds', value: ReduceFunds.SUPPLEMENTAL_LEARNING_FUNDS },
]
