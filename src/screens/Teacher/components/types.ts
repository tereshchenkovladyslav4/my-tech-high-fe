import { ReactElement } from 'react'

export type CircleData = {
  color?: string
  progress: number
  type?: string
  icon?: ReactElement<unknown, string>
  mobileColor?: string
  mobileText?: string
  message?: string
}
