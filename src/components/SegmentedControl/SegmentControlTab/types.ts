import { FunctionComponent, ReactNode } from 'react'
import { Theme } from '@emotion/react'
import { SxProps } from '@mui/system'

export type LinkTabProps = {
  label: string | ReactNode
  href: string
  className?: string
  sx?: SxProps<Theme> | undefined
}

export type SegmentControlTabTemplateType = FunctionComponent<LinkTabProps>
