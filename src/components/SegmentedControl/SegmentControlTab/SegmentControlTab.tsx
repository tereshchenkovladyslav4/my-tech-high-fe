import React from 'react'
import { Tab } from '@mui/material'
import { LinkTabProps, SegmentControlTabTemplateType } from './types'

export const LinkTab: SegmentControlTabTemplateType = (props: LinkTabProps) => (
  <Tab
    component='a'
    onClick={(event: React.ChangeEvent<unknown>) => {
      event.preventDefault()
    }}
    {...props}
    style={{ color: '#CCCCCC' }}
  />
)
