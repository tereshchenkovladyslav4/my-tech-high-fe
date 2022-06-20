import React from 'react'
import { Stack, TextField } from '@mui/material'
import { CalendarProps } from './CalendarProps'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

export default function Calendar({ date, label, handleChange }: CalendarProps) {
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
