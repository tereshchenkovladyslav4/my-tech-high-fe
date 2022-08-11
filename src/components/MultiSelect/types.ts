import { DropDownItem } from '../DropDown/types'

type FormikCustomError = {
  error: boolean | undefined
  errorMsg: string
}

export type MultiSelectProps = {
  options: DropDownItem[]
  label?: string
  renderValue?: string
  defaultValue?: (string | number)[]
  error?: FormikCustomError
  disabled?: boolean
  onChange: (value: (string | number)[]) => void
}
