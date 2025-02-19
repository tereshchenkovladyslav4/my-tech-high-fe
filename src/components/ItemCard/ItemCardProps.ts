import { ReactNode } from 'react'

export interface ItemCardProps {
  icon?: string | ReactNode
  title: string | ReactNode
  subTitle?: string
  img: string
  link: string
  isLink?: boolean
  hasTitle?: boolean
  disabled?: boolean
  onClick?: () => void
}
