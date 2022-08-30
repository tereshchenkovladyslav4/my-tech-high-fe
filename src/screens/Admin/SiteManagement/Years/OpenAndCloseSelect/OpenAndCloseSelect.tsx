import React from 'react'
import { Stack } from '@mui/material'
import { MthDatePicker } from '@mth/components/MthDatePicker/MthDatePicker'
import { SchoolYearItem } from '../types'

type OpenAndCloseSelectProps = {
  item: SchoolYearItem | undefined
  setItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
}

export const OpenAndCloseSelect: React.FC<OpenAndCloseSelectProps> = ({ item, setItem, setIsChanged }) => {
  const openHandleChange = (value: string | null) => {
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

  const closeHandleChange = (value: string | null) => {
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
        <MthDatePicker date={item?.open} maxDate={item?.close} label={'Open Date'} handleChange={openHandleChange} />
        <MthDatePicker date={item?.close} minDate={item?.open} label={'Close Date'} handleChange={closeHandleChange} />
      </Stack>
    </Stack>
  )
}
