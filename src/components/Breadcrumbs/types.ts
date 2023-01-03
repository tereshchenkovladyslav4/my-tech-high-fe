import { Dispatch, SetStateAction } from 'react'

export type Step = {
  label: string
  active: boolean
  border?: string
}

export type BreadCrumbsProps = {
  steps: Step[]
  handleClick?: Dispatch<SetStateAction<number>>
}
