import React from 'react'
import { Button, Box } from '@mui/material'
import { WITHDRAWAL_STATUS_LABEL } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { WithdrawalFiltersProps } from '../type'

const WithdrawalFilters: React.FC<WithdrawalFiltersProps> = ({ filters, setFilters, withdrawCount }) => {
  const handleSelectFilter = (value: string) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((item) => item !== value))
    } else {
      setFilters([...filters, ...[value]])
    }
  }

  const getCount = (value: string) => {
    switch (value) {
      case 'Notified':
        return withdrawCount?.Notified || 0
      case 'Requested':
        return withdrawCount?.Requested || 0
      case 'Withdrawn':
        return withdrawCount?.Withdrawn || 0
      default:
        return 0
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingX: '100px',
        marginY: 2,
      }}
    >
      {WITHDRAWAL_STATUS_LABEL.map((label: string, index) => (
        <Button
          key={index}
          variant={filters.includes(label) ? 'text' : 'outlined'}
          sx={{
            background: (filters.includes(label) && MthColor.BUTTON_LINEAR_GRADIENT) || null,
            color: filters.includes(label) ? 'white' : MthColor.MTHBLUE,
            borderRadius: 2,
            textTransform: 'none',
            height: 25,
            whiteSpace: 'nowrap',
          }}
          onClick={() => handleSelectFilter(label)}
        >
          {label} ({getCount(label)})
        </Button>
      ))}
    </Box>
  )
}

export default WithdrawalFilters
