import React from 'react'
import { Stack } from '@mui/material'
import moment from 'moment'
import { SchoolYearItem } from '../types'
import { Calendar } from '../../components/Calendar'
type OpenAndCloseSelectProps = {
  item: SchoolYearItem | undefined
  setItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
}

export default function OpenAndCloseSelect({ item, setItem, setIsChanged }: OpenAndCloseSelectProps) {
  const openHandleChange = (value: Date | null) => {
    if (value) {
      if (item) setItem({ ...item, open: moment(value).format('MM/DD/yyyy') })
      setIsChanged(true)
    }
  }

  const closeHandleChange = (value: Date | null) => {
    if (value) {
      if (item) setItem({ ...item, close: moment(value).format('MM/DD/yyyy') })
      setIsChanged(true)
    }
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
        <Calendar date={item?.open} label={'Open Date'} handleChange={openHandleChange} />
        <Calendar date={item?.close} label={'Close Date'} handleChange={closeHandleChange} />
      </Stack>
    </Stack>
  )
}
