import React, { FunctionComponent } from 'react'
import { Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { CalendarProps } from './CalendarProps'

export const Calendar: FunctionComponent<CalendarProps> = ({ date, label, handleChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3} marginRight={8}>
        <MobileDatePicker
          label={label || 'Date'}
          inputFormat='MM/dd/yyyy'
          value={date}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  )
}
