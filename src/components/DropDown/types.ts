import { ReactNode } from 'react'
import { Theme } from '@emotion/react'
import { SxProps } from '@mui/system'
import { AdditionalQuestionAction, QUESTION_TYPE } from '@mth/enums'

export type DropDownItem = {
  label: string | number | ReactNode
  value: string | number
  action?: AdditionalQuestionAction
  hasDeleteIcon?: boolean
  handleDeleteItem?: (value: string | number | boolean) => void
  disabled?: boolean
}

type FormikCustomError = {
  error: boolean | undefined
  errorMsg: string
}

export type DropDownProps = {
  dropDownItems: DropDownItem[]
  placeholder?: string
  setParentValue: (value: string | number | QUESTION_TYPE) => void
  labelTop?: boolean
  sx?: SxProps<Theme> | undefined
  alternate?: boolean
  size?: 'small' | 'medium'
  defaultValue?: string | number
  error?: FormikCustomError
  name?: string
  disabled?: boolean
  dropdownColor?: string
  color?: string
  isAddable?: boolean
  auto?: boolean
  borderNone?: boolean
}
