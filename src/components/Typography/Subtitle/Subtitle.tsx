import React from 'react'
import { Typography } from '@mui/material'

import { TypographyTemplateType } from '../types'

export const Subtitle: TypographyTemplateType = ({
  textAlign,
  children,
  size,
  color,
  fontWeight,
  sx,
  onClick,
  className,
}) => {
  const fontSize = () => (size === 'large' ? 20 : size === 'medium' ? 18 : 16)

  return (
    <Typography
      textAlign={textAlign}
      sx={sx}
      fontWeight={fontWeight}
      color={color}
      fontSize={fontSize}
      onClick={onClick}
      className={className}
    >
      {children}
    </Typography>
  )
}
