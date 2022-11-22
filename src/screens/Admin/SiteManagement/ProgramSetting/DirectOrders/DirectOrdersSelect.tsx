import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { ADMIN_REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { ReduceFunds } from '@mth/enums'
import { ProgramSettingChanged } from '../types'

type DirectOrdersSelectProps = {
  directOrders: ReduceFunds | undefined
  setDirectOrders: (value: ReduceFunds) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const DirectOrdersSelect: React.FC<DirectOrdersSelectProps> = ({
  directOrders,
  setDirectOrders,
  setIsChanged,
  isChanged,
}) => {
  const handleChange = (value: ReduceFunds) => {
    setDirectOrders(value)
    setIsChanged({
      ...isChanged,
      directOrders: true,
    })
  }

  return (
    <Box sx={{ width: '100%', flexDirection: 'row' }} style={{ display: 'flex' }}>
      <DropDown
        dropDownItems={ADMIN_REDUCE_FUNDS_ITEMS}
        placeholder={'Select'}
        defaultValue={directOrders}
        sx={{ width: '160px', marginLeft: '13px' }}
        borderNone={false}
        setParentValue={(value) => handleChange(value.toString() as ReduceFunds)}
      />
    </Box>
  )
}
