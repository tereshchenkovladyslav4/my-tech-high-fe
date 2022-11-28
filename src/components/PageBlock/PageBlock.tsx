import React from 'react'
import { Box } from '@mui/material'
import { MthColor } from '@mth/enums'

export const PageBlock: React.FC = ({ children }) => {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '12px',
        backgroundColor: MthColor.WHITE,
        boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)',
      }}
    >
      {children}
    </Box>
  )
}
