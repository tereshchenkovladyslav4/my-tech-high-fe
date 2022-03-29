import { Box } from '@mui/system'
import React from 'react'
import { DataRowTemplateType } from './types'

export const DataRow: DataRowTemplateType = ({ label, value, backgroundColor }) => (
  <Box
    display='flex'
    flexDirection='row'
    justifyContent='space-between'
    sx={{ backgroundColor, marginX: 4, marginY: 2, paddingY: 2, paddingX: 2 }}
    alignItems='center'
  >
    {label}
    {value}
  </Box>
)
