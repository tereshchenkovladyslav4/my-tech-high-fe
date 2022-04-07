import React, { useState, useEffect } from 'react'
import ReactInputDateMask from 'react-input-date-mask';
import { Box, TextField, Typography, Stack } from '@mui/material'
import { makeStyles } from '@material-ui/core'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
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
  }
})

type BirthDateCutOffSelectProps = {
  birthDate: string
  invalid: boolean
  setbirthDate: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function BirthDateCutOffSelect({ birthDate, invalid, setBirthDate, setIsChanged }: BirthDateCutOffSelectProps) {
  const handleChange = (value: React.ChangeEvent<ReactInputDateMask>) => {
    setBirthDate(value)
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
        <ReactInputDateMask 
          className={`${classes.DateMask} ${invalid ? classes.DateMaskInvalid : ''}`}
          mask='mm/dd/yyyy' 
          showMaskOnFocus={true}
          value={birthDate} 
          onChange={handleChange} 
          showMaskOnHover={true} 
        />
      </Box>
    </Stack>
  )
}
