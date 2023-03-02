import React from 'react'
import { TextField, styled } from '@mui/material'
import { MthColor } from '@mth/enums'
import { MthTimePickerProps } from './types'

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})(() => ({
  '& .MuiOutlinedInput-root': {
    height: '56px',
    '& fieldset': {
      border: '1px solid rgba(26, 26, 26, 0.25) !important',
    },
    color: MthColor.SYSTEM_01,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ccc',
    borderWidth: '1px',
  },
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: '#ccc',
    borderWidth: '1px',
  },
  height: '58px !important',
}))

export const MthTimePicker: React.FC<MthTimePickerProps> = ({ label = 'Time', size = 'small', time, handleChange }) => {
  return (
    <CssTextField
      label={label}
      type='time'
      size={size}
      value={time || '00:00'}
      className='MthFormField'
      inputProps={{
        step: 300,
      }}
      InputLabelProps={{
        style: {
          color: MthColor.SYSTEM_06,
        },
      }}
      sx={{ width: '100%', my: 1, svg: { color: 'red' } }}
      onChange={(e) => {
        handleChange(e.target.value)
      }}
    />
  )
}
