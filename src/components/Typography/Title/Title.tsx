import React from 'react'
import { Typography } from '@mui/material'
import { TypographyProps } from '../types'

export const Title: React.FC<TypographyProps> = ({ sx, fontWeight, children, size, color, textAlign }) => {
  const fontSize = () => (size === 'large' ? 32 : size === 'medium' ? 28 : 24)

  return (
    <Typography fontWeight={fontWeight || 'bold'} fontSize={fontSize} color={color} textAlign={textAlign} sx={sx}>
      {children}
    </Typography>
  )
}
