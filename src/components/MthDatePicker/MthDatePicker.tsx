import React from 'react'
import { Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import moment from 'moment'
import { MYSQL_DATE_FORMAT } from '@mth/constants'
import { MthDatePickerProps } from './types'

export const MthDatePicker: React.FC<MthDatePickerProps> = ({
  date,
  label,
  dateFormat = MYSQL_DATE_FORMAT,
  minDate,
  maxDate,
  handleChange,
}) => {
  // The x-date-picker works correctly only at midnight
  const convert2MidNight = (val: Date | string) => {
    const tempDate = typeof val === 'string' ? new Date(val) : val
    return moment(tempDate)
      .add(tempDate.getTimezoneOffset() + 60, 'minutes')
      .toDate()
  }

  // Should store local date string
  const convert2LocalDate = (val: Date) => {
    return moment(val)
      .subtract(val.getTimezoneOffset() - 60, 'minutes')
      .utc()
      .format(dateFormat)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3} marginRight={8}>
        <MobileDatePicker
          label={label || 'Date'}
          inputFormat='MM/dd/yyyy'
          value={date && convert2MidNight(date)}
          minDate={minDate && convert2MidNight(minDate)}
          maxDate={maxDate && convert2MidNight(maxDate)}
          onChange={(val) => {
            handleChange(val ? convert2LocalDate(val) : null)
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  )
}
