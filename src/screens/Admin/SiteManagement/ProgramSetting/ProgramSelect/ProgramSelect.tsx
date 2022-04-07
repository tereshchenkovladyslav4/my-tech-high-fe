import React, { useState, useEffect } from 'react'
import { Box, TextField, Stack, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'

type ProgramSelectProps = {
  program: string
  setProgram: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function ProgramSelect({ program, setProgram, setIsChanged }: ProgramSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setProgram(event.target.value)
    setIsChanged(true)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        Program
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
            value={program ? program : ''}
            onChange={handleChange}
            label='Program'
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value={'MTH'}>MTH</MenuItem>
            <MenuItem value={'TTA'}>TTA</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Stack>
  )
}
