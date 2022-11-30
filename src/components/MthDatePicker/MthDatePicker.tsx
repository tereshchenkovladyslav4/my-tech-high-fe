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
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3} marginRight={8}>
        <MobileDatePicker
          label={label || 'Date'}
          inputFormat='MM/dd/yyyy'
          value={date && moment(date).toDate()}
          minDate={minDate && moment(minDate).toDate()}
          maxDate={maxDate && moment(maxDate).toDate()}
          onChange={(val) => {
            handleChange(val ? moment(val).format(dateFormat) : null)
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  )
}
