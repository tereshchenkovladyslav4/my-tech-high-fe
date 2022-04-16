import React from 'react'
import { TextField, Stack, Typography } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

type SchoolYearSelectProps = {
  schoolYearOpen: string
  schoolYearClose: string
  setSchoolYearOpen: (value: string) => void
  setSchoolYearClose: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function SchoolYearSelect({ 
  schoolYearOpen, 
  schoolYearClose, 
  setSchoolYearOpen, 
  setSchoolYearClose, 
  setIsChanged 
}: SchoolYearSelectProps) {
  const openHandleChange = (value: Date | null) => {
    if (value) {
      setSchoolYearOpen(moment(value).format('MM/DD/yyyy'))
      setIsChanged(true)
    }
  }

  const closeHandleChange = (value: Date | null) => {
    if (value) {
      setSchoolYearClose(moment(value).format('MM/DD/yyyy'))
      setIsChanged(true)
    }
  }
  
  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 180 }}>
        School Year
      </Subtitle>
      <Typography>|</Typography>
      <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
        <Subtitle color={'#000'} size={16} fontWeight='600' textAlign='left' sx={{ mx: 1.2, minWidth: 'auto' }}>
          Open
        </Subtitle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label='Select Open Date'
              inputFormat='MM/dd/yyyy'
              value={schoolYearOpen}
              onChange={openHandleChange}
              renderInput={(params) => <TextField {...params}/>}
            />
          </Stack>
        </LocalizationProvider>
        <Subtitle color={'#000'} size={16} fontWeight='600' textAlign='left' sx={{ mx: 1.2, minWidth: 60 }}/>
        <Subtitle color={'#000'} size={16} fontWeight='600' textAlign='left' sx={{ mx: 1.2, minWidth: 'auto' }}>
          Close
        </Subtitle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label='Select Close Date'
              inputFormat='MM/dd/yyyy'
              value={schoolYearClose}
              onChange={closeHandleChange}
              renderInput={(params) => <TextField {...params}/>}
            />
          </Stack>
        </LocalizationProvider>
      </Stack>
    </Stack>
  )
}
