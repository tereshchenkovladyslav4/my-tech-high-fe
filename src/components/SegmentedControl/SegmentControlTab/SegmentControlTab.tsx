import { Tab } from '@mui/material'
import React from 'react'
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
