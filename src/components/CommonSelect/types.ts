import { ReactNode } from 'react'

export type CommonSelectType = {
  name: string | ReactNode
  component: ReactNode
  mergedItems?: CommonSelectType[]
}
