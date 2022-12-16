import { ReactNode } from 'react'

export type CommonSelectType = {
  name: string
  component: ReactNode
}

export type SiteManagementItem = {
  id: number
  title: string
  subtitle: string
  img: string
  to: string
  isLink?: boolean
  action?: boolean
  disabled?: boolean
}
