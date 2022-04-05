import React, { useState, useEffect } from 'react'
import { Box, TextField, Typography, Stack } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
type StateSelectProps = {
  stateName: string
  setStateName: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function StateSelect({ stateName, setStateName, setIsChanged }: StateSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateName(event.target.value)
    setIsChanged(true)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        State
      </Subtitle>
      <Typography>|</Typography>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, minWidth: '150' },
        }}
        noValidate
        autoComplete='off'
      >
        <TextField id='outlined-name' value={stateName} onChange={handleChange} />
      </Box>
    </Stack>
  )
}
