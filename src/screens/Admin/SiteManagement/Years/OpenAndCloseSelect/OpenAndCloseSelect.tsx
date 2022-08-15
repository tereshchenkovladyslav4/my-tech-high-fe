import React from 'react'
import { Stack } from '@mui/material'
import { Calendar } from '../../components/Calendar'
import { SchoolYearItem } from '../types'
type OpenAndCloseSelectProps = {
  item: SchoolYearItem | undefined
  setItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
}

export const OpenAndCloseSelect: React.FC<OpenAndCloseSelectProps> = ({ item, setItem, setIsChanged }) => {
  const openHandleChange = (value: Date | null) => {
    if (value) {
      if (item) setItem({ ...item, open: value })
      else
        setItem({
          open: value,
          close: undefined,
          status: false,
        })
      setIsChanged(true)
    }
  }

  const closeHandleChange = (value: Date | null) => {
    if (value) {
      if (item) setItem({ ...item, close: value })
      else
        setItem({
          open: undefined,
          close: value,
          status: false,
        })
      setIsChanged(true)
    }
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
        <Calendar
          date={item?.open}
          maxDate={item?.close || undefined}
          label={'Open Date'}
          handleChange={openHandleChange}
        />
        <Calendar
          date={item?.close}
          minDate={item?.open || undefined}
          label={'Close Date'}
          handleChange={closeHandleChange}
        />
      </Stack>
    </Stack>
  )
}
