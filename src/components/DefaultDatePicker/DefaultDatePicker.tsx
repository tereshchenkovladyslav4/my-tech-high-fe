import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DefaultDatePickerProps } from './types'

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      height: '56px',
      maxWidth: '220px',
    },
  },
})(TextField)

export const DefaultDatePicker: React.FC<DefaultDatePickerProps> = ({ date, label, handleChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label || 'Start Date'}
        value={date || new Date()}
        onChange={(e) => {
          handleChange(e)
        }}
        renderInput={(params) => <CssTextField color='primary' size='small' {...params} />}
      />
    </LocalizationProvider>
  )
}
