import { Typography } from '@mui/material'

import { TypographyTemplateType } from '../types'

export const Title: TypographyTemplateType = ({ sx, fontWeight, children, size, color, textAlign }) => {
  const fontSize = () => (size === 'large' ? 32 : size === 'medium' ? 28 : 24)

  return (
    <Typography fontWeight={fontWeight || 'bold'} fontSize={fontSize} color={color} textAlign={textAlign} sx={sx}>
      {children}
    </Typography>
  )
}
