import { FunctionComponent, ReactNode } from 'react'

export type MetadataProps = {
  image?: ReactNode
  title: string | ReactNode
  subtitle: string | ReactNode
  secondaryAction?: ReactNode
  rounded?: boolean
  verticle?: boolean
  disableGutters?: boolean
  divider?: boolean
  borderBottom?: boolean
}

export type MetadataTemplateType = FunctionComponent<MetadataProps>
