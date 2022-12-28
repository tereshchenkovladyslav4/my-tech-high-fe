import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { map } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { ADMIN_REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { ReduceFunds } from '@mth/enums'
import { ProgramSettingChanged } from '../types'

type DirectOrdersSelectProps = {
  reimbursements: ReduceFunds | undefined
  directOrders: ReduceFunds | undefined
  setDirectOrders: (value: ReduceFunds) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const DirectOrdersSelect: React.FC<DirectOrdersSelectProps> = ({
  reimbursements,
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

  useEffect(() => {
    if (reimbursements !== ReduceFunds.NONE && directOrders !== ReduceFunds.NONE && reimbursements !== directOrders) {
      // Reset direct orders to select again
      setDirectOrders(null)
    }
  }, [reimbursements])

  return (
    <Box sx={{ width: '100%', flexDirection: 'row' }} style={{ display: 'flex' }}>
      <DropDown
        dropDownItems={map(ADMIN_REDUCE_FUNDS_ITEMS, (item) => {
          return {
            ...item,
            disabled:
              reimbursements !== ReduceFunds.NONE && item.value !== ReduceFunds.NONE && item.value !== reimbursements,
          }
        })}
        placeholder={'Select'}
        defaultValue={directOrders}
        sx={{ width: '160px', marginLeft: '13px' }}
        borderNone={false}
        setParentValue={(value) => handleChange(value.toString() as ReduceFunds)}
      />
    </Box>
  )
}
