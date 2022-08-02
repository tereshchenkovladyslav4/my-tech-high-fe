import { FunctionComponent, ReactNode } from 'react'

type EmptyStateProps = {
  title: string | ReactNode
  subtitle: string | ReactNode
  image?: string
}

export type EmptyStateTemplateType = FunctionComponent<EmptyStateProps>
