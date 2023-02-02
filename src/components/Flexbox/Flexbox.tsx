import React from 'react'
import Box from '@mui/material/Box'
import { FlexboxProps } from './types'

export const Flexbox: React.FC<FlexboxProps> = ({ children, flexDirection, textAlign }) => (
  <Box display='flex' flex={1} flexDirection={flexDirection} textAlign={textAlign || 'center'}>
    {children}
  </Box>
)
