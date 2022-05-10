import { Button, Card, Box } from '@mui/material'
import React from 'react'
import { MTHBLUE, BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'

const WithdrawFilters = ({ filters, setFilters, withdrawCount }) => {
  const handleSelectFilter = (value) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((item) => item !== value))
    } else {
      setFilters([...filters, ...[value]])
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
        paddingY: 3,
      }}
    >
      <Button
        variant={filters.includes('Not Started') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Not Started') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Not Started') ? 'white' : MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Not Started')}
      >
        Requested ({withdrawCount && withdrawCount['Requested'] ? withdrawCount['Requested'] : 0})
      </Button>
      <Button
        variant={filters.includes('Started') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters.includes('Started') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Started') ? 'white' : MTHBLUE,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Started')}
      >
        Notified ({withdrawCount && withdrawCount['Notified'] ? withdrawCount['Notified'] : 0})
      </Button>
      <Button
        variant={filters.includes('Missing Info') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Missing Info') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Missing Info') ? 'white' : MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Missing Info')}
      >
        Withdrawn ({withdrawCount && withdrawCount['Withdrawn'] ? withdrawCount['Withdrawn'] : 0})
      </Button>
    </Box>
  )
}

export default WithdrawFilters
