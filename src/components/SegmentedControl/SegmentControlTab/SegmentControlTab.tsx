import React from 'react'
import { Tab } from '@mui/material'
import { LinkTabProps } from './types'

export const LinkTab: React.FC<LinkTabProps> = (props: LinkTabProps) => (
  <Tab
    component='a'
    onClick={(event: React.ChangeEvent<unknown>) => {
      event.preventDefault()
    }}
    {...props}
    style={{ color: '#CCCCCC' }}
  />
)
