import React from 'react'
import { TextField, Stack, Typography } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
type ApplicationsSelectProps = {
  applicationsOpen: string
  applicationsClose: string
  setApplicationsOpen: (value: string) => void
  setApplicationsClose: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function ApplicationsSelect({ 
  applicationsOpen, 
  applicationsClose, 
  setApplicationsOpen, 
  setApplicationsClose, 
  setIsChanged 
}: ApplicationsSelectProps) {
  const openHandleChange = (value: Date | null) => {
    if (value) {
      setApplicationsOpen(moment(value).format('MM/DD/yyyy'))
      setIsChanged(true)
    }
  }

  const closeHandleChange = (value: Date | null) => {
    if (value) {
      setApplicationsClose(moment(value).format('MM/DD/yyyy'))
      setIsChanged(true)
    }
  }
  
  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 180 }}>
        Applications
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
              value={applicationsOpen}
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
              value={applicationsClose}
              onChange={closeHandleChange}
              renderInput={(params) => <TextField {...params}/>}
            />
          </Stack>
        </LocalizationProvider>
      </Stack>
    </Stack>
  )
}
