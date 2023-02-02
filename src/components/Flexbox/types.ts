import { ReactNode } from 'react'

export type FlexboxProps = {
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  children: ReactNode
  textAlign?: 'left' | 'center'
}
