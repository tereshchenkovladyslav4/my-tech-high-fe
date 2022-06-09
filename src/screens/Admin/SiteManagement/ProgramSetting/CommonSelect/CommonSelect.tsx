import React from 'react'
import { Box, Stack } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../../styles'

export default function CommonSelect({ index, selectItem }) {
  const classes = useStyles
  return (
    <Stack
      key={index}
      direction='row'
      spacing={1}
      sx={{ ...classes.selectBox, background: index % 2 == 0 ? '#FAFAFA' : '' }}
    >
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        {selectItem?.name}
      </Subtitle>
      <Box sx={{ ...classes.verticalLine, height: selectItem?.name == 'State Logo' ? '160px' : '53px' }}></Box>
      {selectItem?.component}
    </Stack>
  )
}
