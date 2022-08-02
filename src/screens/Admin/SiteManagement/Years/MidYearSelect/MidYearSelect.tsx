import React, { FunctionComponent, useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Stack } from '@mui/material'
import { BLACK } from '../../../../../utils/constants'
import { DropDown } from '../../components/DropDown/DropDown'
import { SchoolYearItem } from '../types'

type MideYearSelectProps = {
  midYearItem: SchoolYearItem | undefined
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
  setMidYearExpend: (value: boolean) => void
}

export const MidYearSelect: FunctionComponent<MideYearSelectProps> = ({
  midYearItem,
  setMidYearItem,
  setMidYearExpend,
  setIsChanged,
}) => {
  const statusHandleChange = (value: string) => {
    if (midYearItem) setMidYearItem({ ...midYearItem, status: value == 'true' ? true : false })
    setIsChanged(true)
  }
  const [expand, setExpand] = useState<boolean>(false)

  const items = [
    {
      label: 'Enabled',
      value: 'true',
    },
    {
      label: 'Disabled',
      value: 'false',
    },
  ]

  const chevron = () =>
    !expand ? (
      <ExpandLessIcon
        sx={{
          color: BLACK,
          verticalAlign: 'bottom',
          cursor: 'pointer',
          marginRight: 10,
          marginTop: 3,
        }}
        onClick={() => {
          setExpand(true)
          setMidYearExpend(true)
        }}
      />
    ) : (
      <ExpandMoreIcon
        sx={{
          color: BLACK,
          verticalAlign: 'bottom',
          cursor: 'pointer',
          marginRight: 10,
          marginTop: 3,
        }}
        onClick={() => {
          setExpand(false)
          setMidYearExpend(false)
        }}
      />
    )

  return (
    <Stack direction='row' spacing={1} width={'100%'} alignItems='center' sx={{ my: 2 }}>
      <Stack direction='row' width={'100%'} sx={{ ml: 1.5 }} alignItems='center'>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <DropDown
            dropDownItems={items}
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
