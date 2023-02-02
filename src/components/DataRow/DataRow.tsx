import React from 'react'
import { Box } from '@mui/system'
import { DataRowProps } from './types'

export const DataRow: React.FC<DataRowProps> = ({ label, value, backgroundColor }) => (
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
