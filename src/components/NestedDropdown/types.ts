import { ReactNode } from 'react'

export interface MenuItemData {
  uid?: string
  label?: string | ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  callback?: () => void
  items?: MenuItemData[]
  moreItems?: MenuItemData[]
  showMoreLabel?: string | ReactNode
  showLessLabel?: string | ReactNode
}
