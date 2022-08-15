import React from 'react'
import { Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { CalendarProps } from './CalendarProps'

export const Calendar: React.FC<CalendarProps> = ({ date, minDate, maxDate, label, handleChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3} marginRight={8}>
        <MobileDatePicker
          label={label || 'Date'}
          inputFormat='MM/dd/yyyy'
          value={date || null}
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  )
}
