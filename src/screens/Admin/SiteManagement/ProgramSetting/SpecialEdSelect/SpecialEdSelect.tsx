import React, { useState, useEffect } from 'react'
import { Box, TextField, Stack, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'

type SpecialEdSelectProps = {
  specialEd: boolean
  setSpecialEd: (value: boolean) => void
  setIsChanged: (value: boolean) => void
}

export default function SpecialEdSelect({ specialEd, setSpecialEd, setIsChanged }: SpecialEdSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setSpecialEd(event.target.value)
    setIsChanged(true)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        Special Ed
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
        <FormControl variant='standard' sx={{ m: 1, minWidth: 200 }}>
          <Select
            labelId='demo-simple-select-standard-label'
            id='demo-simple-select-standard'
            value={specialEd ? true : false}
            onChange={handleChange}
            label='SpecialEd'
          >
            <MenuItem value={true}>Enabled</MenuItem>
            <MenuItem value={false}>Disabled</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Stack>
  )
}
