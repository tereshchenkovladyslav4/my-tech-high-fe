import React from 'react'
import { Box } from '@mui/material'

export const Layout: React.FC = ({ children }) => {
  return <Box sx={{ p: 4, textAlign: 'left' }}>{children}</Box>
}
