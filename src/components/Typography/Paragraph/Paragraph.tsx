import React from 'react'
import { Typography } from '@mui/material'
import { TypographyProps } from '../types'

export const Paragraph: React.FC<TypographyProps> = ({
  children,
  size,
  color,
  fontWeight,
  fontFamily,
  textAlign,
  sx,
  onClick,
}) => {
  const fontSize = () => (size === 'large' ? 14 : size === 'medium' ? 12 : 10)

  return (
    <Typography
      fontWeight={fontWeight}
      color={color}
      fontSize={fontSize}
      fontFamily={fontFamily}
      textAlign={textAlign}
      sx={sx}
      onClick={onClick}
    >
      {children}
    </Typography>
  )
}
