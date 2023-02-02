import { FunctionComponent, ReactNode } from 'react'

export type EmptyStateProps = {
  title: string | ReactNode
  subtitle: string | ReactNode
  image?: string
}

export type EmptyStateTemplateType = FunctionComponent<EmptyStateProps>
