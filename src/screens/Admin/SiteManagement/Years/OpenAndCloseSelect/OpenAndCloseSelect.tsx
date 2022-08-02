import React, { FunctionComponent } from 'react'
import { Stack } from '@mui/material'
import { Calendar } from '../../components/Calendar'
import { SchoolYearItem } from '../types'
type OpenAndCloseSelectProps = {
  item: SchoolYearItem | undefined
  setItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
}

export const OpenAndCloseSelect: FunctionComponent<OpenAndCloseSelectProps> = ({ item, setItem, setIsChanged }) => {
  const openHandleChange = (value: Date | null) => {
    if (value) {
      if (item) setItem({ ...item, open: value })
      setIsChanged(true)
    }
  }

  const closeHandleChange = (value: Date | null) => {
    if (value) {
      if (item) setItem({ ...item, close: value })
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
