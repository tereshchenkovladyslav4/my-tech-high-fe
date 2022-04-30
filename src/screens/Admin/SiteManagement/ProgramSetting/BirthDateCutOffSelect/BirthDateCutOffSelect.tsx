import React from 'react'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Box, TextField, Typography, Stack } from '@mui/material'
import { makeStyles } from '@material-ui/core'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
const useStyles = makeStyles({
  DateMask: {
    font: 'inherit',
    letterSpacing: 'inherit',
    color: 'currentColor',
    border: 0,
    boxSizing: 'content-box',
    background: 'none',
    height: '1.4375em',
    margin: 0,
    display: 'block',
    minWidth: 0,
    animationName: 'mui-auto-fill-cancel',
    animationDuration: '10ms',
    padding: '16.5px 14px',
  },
  DateMaskInvalid: {
    border: '1px solid red',
    borderRadius: '5px',
  },
})

type BirthDateCutOffSelectProps = {
  birthDate: string
  setBirthDate: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function BirthDateCutOffSelect({ birthDate, setBirthDate, setIsChanged }: BirthDateCutOffSelectProps) {
  const handleChange = (value: Date | null) => {
    setBirthDate(moment(value).format('MM/DD/YYYY'))
    setIsChanged(true)
  }
  const classes = useStyles()
  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        Birth Date Cut-off
      </Subtitle>
      <Typography>|</Typography>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, minWidth: '150' },
        }}
        noValidate
        autoComplete='off'
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label='Birth Date Cut-off'
              inputFormat='MM/dd/yyyy'
              value={birthDate}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
      </Box>
    </Stack>
  )
}
