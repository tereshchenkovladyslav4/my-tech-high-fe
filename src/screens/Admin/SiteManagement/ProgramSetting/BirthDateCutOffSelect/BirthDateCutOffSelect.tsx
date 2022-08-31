import React from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import { Calendar } from '../../components/Calendar'
import { useStyles } from '../../styles'

type BirthDateCutOffSelectProps = {
  birthDate: string
  setBirthDate: (value: string) => void
}

export const BirthDateCutOffSelect: React.FC<BirthDateCutOffSelectProps> = ({ birthDate, setBirthDate }) => {
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
