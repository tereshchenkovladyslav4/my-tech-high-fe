import { ReactNode } from 'react'
import { CustomModalType } from '@mth/components/CustomModal/CustomModals'

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
  customModalProps?: Partial<CustomModalType>
}
