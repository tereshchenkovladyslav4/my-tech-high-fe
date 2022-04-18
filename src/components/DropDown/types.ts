import { Theme } from '@emotion/react'
import { SxProps } from '@mui/system'
import { FunctionComponent, ReactNode } from 'react'

export type DropDownItem = {
  label: string | number
  value: string | number
}

type FormikCustomError = {
  error: boolean,
  errorMsg: string
}

type DropDownProps = {
  dropDownItems: DropDownItem[]
  placeholder?: string
  setParentValue: (value: any, val: any) => void
  labelTop?: boolean
  sx?: SxProps<Theme> | undefined
  alternate?: boolean
  size?: 'small' | 'medium'
  defaultValue?: any
  error?: FormikCustomError
  name?: string
  disabled?: boolean
  dropdownColor?: string
  isAddable?: boolean
  idx?: number
}

export type DropDownTemplateType = FunctionComponent<DropDownProps>
