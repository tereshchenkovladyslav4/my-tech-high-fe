import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'

export type TextFieldProps = {
  label?: string
  onChange: (value: React.SetStateAction<string>) => void
  sx?: SxProps<Theme> | undefined
  size?: 'small' | 'medium'
  defaultValue?: unknown
  value?: string
  variant?: 'outlined' | 'filled' | 'standard'
  disabled?: boolean
  fullWidth?: boolean
  style?: SxProps<Theme> | undefined
  placeholder?: string
}
