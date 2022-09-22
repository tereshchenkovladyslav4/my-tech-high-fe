import { ReactNode } from 'react'
export interface ItemCardProps {
  icon?: string | ReactNode
  title: string
  subTitle: string
  img: string
  link: string
  isLink?: boolean
  action?: boolean
  hasTitle?: boolean
  disabled?: boolean
  onClick?: () => void
}
