import React from 'react'
import Box from '@mui/material/Box'
import { FlexboxType } from './types'

export const Flexbox: FlexboxType = ({ children, flexDirection, textAlign }) => (
  <Box display='flex' flex={1} flexDirection={flexDirection} textAlign={textAlign || 'center'}>
    {children}
  </Box>
)
