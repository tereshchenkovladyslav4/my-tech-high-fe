import { FunctionComponent } from 'react'
import { DropDownItem } from '../DropDown/types'

type FormikCustomError = {
  error: boolean | undefined
  errorMsg: string
}

type MultiSelectProps = {
  options: DropDownItem[]
  renderValue?: string
  placeholder?: string
  defaultValue?: unknown[]
  error?: FormikCustomError
  disabled?: boolean
  onChange: (value: unknown[]) => void
}

export type MultiSelectTemplateType = FunctionComponent<MultiSelectProps>
