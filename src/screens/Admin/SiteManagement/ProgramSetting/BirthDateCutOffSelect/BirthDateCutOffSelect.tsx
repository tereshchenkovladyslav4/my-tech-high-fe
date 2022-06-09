import React from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import { useStyles } from '../../styles'
import { Calendar } from '../../components/Calendar'

type BirthDateCutOffSelectProps = {
  birthDate: string
  setBirthDate: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function BirthDateCutOffSelect({ birthDate, setBirthDate, setIsChanged }: BirthDateCutOffSelectProps) {
  const classes = useStyles
  const handleChange = (value: Date | null) => {
    setBirthDate(moment(value).format('MM/DD/YYYY'))
    setIsChanged(true)
  }
  return (
    <Box component='form' sx={{ ...classes.gradeBox, maxWidth: '190px' }} noValidate autoComplete='off'>
      <Calendar birthDate={birthDate} handleChange={handleChange} />
    </Box>
  )
}
