import React from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import { useStyles } from '../../styles'
import { Calendar } from '../../components/Calendar'

type BirthDateCutOffSelectProps = {
  birthDate: string
  setBirthDate: (value: string) => void
}

export default function BirthDateCutOffSelect({ birthDate, setBirthDate }: BirthDateCutOffSelectProps) {
  const classes = useStyles
  const handleChange = (value: Date | null) => {
    setBirthDate(moment(value).format('MM/DD/YYYY'))
  }
  return (
    <Box component='form' sx={{ ...classes.gradeBox, maxWidth: '190px' }} noValidate autoComplete='off'>
      <Calendar date={birthDate} label={'Date'} handleChange={handleChange} />
    </Box>
  )
}
