import React from 'react'
import { Box, TextField, Stack, Typography, Select, MenuItem, FormControl } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

type MideYearSelectProps = {
  midYearStatus: boolean
  midYearOpen: string
  midYearClose: string
  setMidYearStatus: (value: boolean) => void
  setMidYearOpen: (value: string) => void
  setMidYearClose: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function MidYearSelect({ 
  midYearStatus, 
  midYearOpen, 
  midYearClose, 
  setMidYearStatus, 
  setMidYearOpen, 
  setMidYearClose, 
  setIsChanged 
}: MideYearSelectProps) {
  const openHandleChange = (value: Date | null) => {
    if (value) {
      setMidYearOpen(moment(value).format('MM/DD/yyyy'))
      setIsChanged(true)
    }
  }

  const closeHandleChange = (value: Date | null) => {
    if (value) {
      setMidYearClose(moment(value).format('MM/DD/yyyy'))
      setIsChanged(true)
    }
  }

  const statusHandleChange = (e) => {
    setMidYearStatus(e.target.value)
    setIsChanged(true)
  }
  
  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 180 }}>
        Mid Year
      </Subtitle>
      <Typography>|</Typography>
      <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
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
              value={midYearStatus ? true : false}
              onChange={statusHandleChange}
              label='MidYear'
            >
              <MenuItem value={true}>Enabled</MenuItem>
              <MenuItem value={false}>Disabled</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Subtitle color={'#000'} size={16} fontWeight='600' textAlign='left' sx={{ mx: 1.2, minWidth: 'auto' }}>
          Open
        </Subtitle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label='Select Open Date'
              inputFormat='MM/dd/yyyy'
              value={midYearOpen}
              onChange={openHandleChange}
              renderInput={(params) => <TextField {...params}/>}
            />
          </Stack>
        </LocalizationProvider>
        <Subtitle color={'#000'} size={16} fontWeight='600' textAlign='left' sx={{ mx: 1.2, minWidth: 60 }}></Subtitle>
        <Subtitle color={'#000'} size={16} fontWeight='600' textAlign='left' sx={{ mx: 1.2, minWidth: 'auto' }}>
          Close
        </Subtitle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label='Select Close Date'
              inputFormat='MM/dd/yyyy'
              value={midYearClose}
              onChange={closeHandleChange}
              renderInput={(params) => <TextField {...params}/>}
            />
          </Stack>
        </LocalizationProvider>
      </Stack>
    </Stack>
  )
}
