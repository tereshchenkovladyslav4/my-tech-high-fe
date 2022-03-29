import { FunctionComponent } from 'react'

export type BreadcrumbProps = {
  title: string
  active?: boolean,
  idx: number
  handleClick?: (_) => void
}

export type BreadcrumbTemplateType = FunctionComponent<BreadcrumbProps>
