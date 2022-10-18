import React, { FunctionComponent } from 'react'
import { Button, Box } from '@mui/material'
import { BUTTON_LINEAR_GRADIENT, BLACK } from '../../../../utils/constants'

type EnrollmentScheduleProps = {
  filters: string[]
  setFilters: (_: string[]) => void
  scheduleCount: {
    Submitted: number
    Resubmitted: number
    'Updates Requested': number
    'Updates Required': number
    'Not Submitted': number
  }
}
export const ScheduleTableFilters: FunctionComponent<EnrollmentScheduleProps> = ({
  filters,
  setFilters,
  scheduleCount,
}) => {
  const handleSelectFilter = (value: string) => {
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
        justifyContent: 'space-between',
        marginTop: '27px',
        marginBottom: '30px',
        paddingY: 3,
      }}
    >
      <Button
        variant={filters.includes('Submitted') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Submitted') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Submitted') ? 'white' : BLACK,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Submitted')}
      >
        Submitted ({scheduleCount['Submitted'] || 0})
      </Button>
      <Button
        variant={filters.includes('Resubmitted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters.includes('Resubmitted') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Resubmitted') ? 'white' : BLACK,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Resubmitted')}
      >
        Resubmitted ({scheduleCount['Resubmitted'] || 0})
      </Button>
      <Button
        variant={filters.includes('Updates Requested') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Updates Requested') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Updates Requested') ? 'white' : BLACK,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Updates Requested')}
      >
        Updates Requested ({scheduleCount['Updates Requested'] || 0})
      </Button>
      <Button
        variant={filters.includes('Updates Required') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Updates Required') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Updates Required') ? 'white' : BLACK,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Updates Required')}
      >
        Updates Required ({scheduleCount['Updates Required'] || 0})
      </Button>
      <Button
        variant={filters.includes('Not Submitted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters.includes('Not Submitted') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Not Submitted') ? 'white' : BLACK,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Not Submitted')}
      >
        Not Submitted ({scheduleCount['Not Submitted'] || 0})
      </Button>
      <Button
        variant={filters.includes('Accepted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters.includes('Accepted') && BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Accepted') ? 'white' : BLACK,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Accepted')}
      >
        Accepted ({scheduleCount['Accepted'] || 0})
      </Button>
    </Box>
  )
}
