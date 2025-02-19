import React from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import { MYSQL_DATE_FORMAT } from '@mth/constants'
import { Calendar } from '../../components/Calendar'
import { siteManagementClassess } from '../../styles'

type BirthDateCutOffSelectProps = {
  birthDate: string
  setBirthDate: (value: string) => void
}

export const BirthDateCutOffSelect: React.FC<BirthDateCutOffSelectProps> = ({ birthDate, setBirthDate }) => {
  const handleChange = (value: Date | null) => {
    setBirthDate(moment(value).local().format(MYSQL_DATE_FORMAT))
  }
  return (
    <Box component='form' sx={{ ...siteManagementClassess.gradeBox, maxWidth: '190px' }} noValidate autoComplete='off'>
      <Calendar date={new Date(birthDate + 'T00:00:00')} label={'Date'} handleChange={handleChange} />
    </Box>
  )
}
