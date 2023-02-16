import { ReactNode } from 'react'
import { Theme } from '@emotion/react'
import { SxProps } from '@mui/system'

export type TypographyProps = {
  testId?: string
  size?: 'small' | 'medium' | 'large' | number
  children: ReactNode
  color?: string
  fontWeight?: string
  fontFamily?: string
  textAlign?: 'right' | 'left' | 'inherit' | 'center' | 'justify'
  sx?: SxProps<Theme> | undefined
  onClick?: () => void
  className?: string
}
