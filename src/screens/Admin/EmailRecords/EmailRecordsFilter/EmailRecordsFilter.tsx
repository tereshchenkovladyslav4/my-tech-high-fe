import { Button, Card, Box } from '@mui/material'
import React from 'react'
import { MTHBLUE, BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'

export const EmailRecordsFilter = ({ filters, setFilters, recordCount }) => {
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
        variant={filters.includes('Error') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Error') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Error') ? 'white' : MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          width: 150,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Error')}
      >
        Error ({recordCount && recordCount['Error'] ? recordCount['Error'] : 0})
      </Button>
      <Button
        variant={filters.includes('Sent') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          width: 150,
          background: filters.includes('Sent') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Sent') ? 'white' : MTHBLUE,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Sent')}
      >
        Sent ({recordCount && recordCount['Sent'] ? recordCount['Sent'] : 0})
      </Button>      
    </Box>
  )
}
