import React from 'react'
import { Box, Button, Typography, IconButton, Stack, TextField } from '@mui/material'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { useStyles } from '../../styles'
import { useHistory } from 'react-router-dom'
import { CalendarProps } from './CalendarProps'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

export default function Calendar({ birthDate, handleChange }: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <MobileDatePicker
          label='Date'
          inputFormat='MM/dd/yyyy'
          value={birthDate}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  )
}
