import React from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Stack } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { ENABLE_DISABLE_OPTIONS } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { SchoolYearItem } from '../types'

type MidYearSelectProps = {
  midYearItem: SchoolYearItem | undefined
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
  midYearExpended: boolean
  setMidYearExpended: (value: boolean) => void
}

export const MidYearSelect: React.FC<MidYearSelectProps> = ({
  midYearItem,
  setMidYearItem,
  midYearExpended,
  setMidYearExpended,
  setIsChanged,
}) => {
  const statusHandleChange = (value: string | number | boolean) => {
    if (midYearItem) setMidYearItem({ ...midYearItem, status: value == 'true' })
    setIsChanged(true)
  }

  const chevron = () =>
    midYearExpended ? (
      <ExpandLessIcon
        sx={{
          color: MthColor.BLACK,
          verticalAlign: 'bottom',
          cursor: 'pointer',
          marginRight: 10,
          marginTop: 3,
        }}
        onClick={() => {
          setMidYearExpended(false)
        }}
      />
    ) : (
      <ExpandMoreIcon
        sx={{
          color: MthColor.BLACK,
          verticalAlign: 'bottom',
          cursor: 'pointer',
          marginRight: 10,
          marginTop: 3,
        }}
        onClick={() => {
          setMidYearExpended(true)
        }}
      />
    )

  return (
    <Stack direction='row' spacing={1} width={'100%'} alignItems='center' sx={{ my: 2 }}>
      <Stack direction='row' width={'100%'} sx={{ ml: 1.5 }} alignItems='center'>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <DropDown
            dropDownItems={ENABLE_DISABLE_OPTIONS}
            placeholder={'Select status'}
            defaultValue={midYearItem?.status ? 'true' : 'false'}
            sx={{ width: '220px', marginRight: 8 }}
            borderNone={false}
            setParentValue={statusHandleChange}
          />
          {!!midYearItem?.status && chevron()}
        </Box>
      </Stack>
    </Stack>
  )
}
