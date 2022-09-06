import { Theme } from '@emotion/react'
import { SxProps } from '@mui/system'

export type DropDownItem = {
  label: string | number
  value: string | number
}

type FormikCustomError = {
  error: boolean | undefined
  errorMsg: string
}

export type DropDownProps = {
  dropDownItems: DropDownItem[]
  placeholder?: string
  setParentValue: (value: string | number, val: string | number) => void
  labelTop?: boolean
  sx?: SxProps<Theme> | undefined
  alternate?: boolean
  size?: 'small' | 'medium'
  defaultValue?: string | number
  error?: FormikCustomError
  name?: string
  disabled?: boolean
  dropdownColor?: string
  isAddable?: boolean
  idx?: number
  auto?: boolean
  borderNone?: boolean
}
