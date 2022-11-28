import { ReactNode } from 'react'
import { MthRoute } from '@mth/enums'

export type CardItem = {
  id: number
  icon: string | ReactNode
  title: string | ReactNode
  img: string
  link?: MthRoute
  isLink?: boolean
  onClick?: () => void
}

export interface CardGridProps {
  items: CardItem[]
}
