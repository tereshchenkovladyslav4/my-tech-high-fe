import React from 'react'
import { Button, Box } from '@mui/material'
import { MthColor } from '@mth/enums'
import { ScheduleFilterVM, ScheduleCount } from '../type'

type EnrollmentScheduleProps = {
  filters?: ScheduleFilterVM
  setFilters: (_: ScheduleFilterVM) => void
  scheduleCount?: ScheduleCount
}
export const ScheduleTableFilters: React.FC<EnrollmentScheduleProps> = ({ filters, setFilters, scheduleCount }) => {
  const handleSelectFilter = (value: string) => {
    let newStatusList = []
    if (filters?.status?.includes(value)) {
      newStatusList = filters.status.filter((item) => item !== value)
    } else {
      newStatusList = [...(filters?.status ? filters?.status : []), value]
    }
    setFilters({ ...filters, status: newStatusList.length > 0 ? newStatusList : [''] })
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '27px',
        marginBottom: '30px',
        paddingX: '50px',
        paddingY: 3,
      }}
    >
      <Button
        variant={filters?.status?.includes('Submitted') ? 'text' : 'outlined'}
        sx={{
          background: filters?.status?.includes('Submitted') ? MthColor.BUTTON_LINEAR_GRADIENT : '',
          color: filters?.status?.includes('Submitted') ? 'white' : MthColor.BLACK,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Submitted')}
      >
        Submitted ({(scheduleCount && scheduleCount['Submitted']) || 0})
      </Button>
      <Button
        variant={filters?.status?.includes('Resubmitted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters?.status?.includes('Resubmitted') ? MthColor.BUTTON_LINEAR_GRADIENT : '',
          color: filters?.status?.includes('Resubmitted') ? 'white' : MthColor.BLACK,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Resubmitted')}
      >
        Resubmitted ({(scheduleCount && scheduleCount['Resubmitted']) || 0})
      </Button>
      <Button
        variant={filters?.status?.includes('Updates Requested') ? 'text' : 'outlined'}
        sx={{
          background: filters?.status?.includes('Updates Requested') ? MthColor.BUTTON_LINEAR_GRADIENT : '',
          color: filters?.status?.includes('Updates Requested') ? 'white' : MthColor.BLACK,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Updates Requested')}
      >
        Updates Requested ({(scheduleCount && scheduleCount['Updates Requested']) || 0})
      </Button>
      <Button
        variant={filters?.status?.includes('Updates Required') ? 'text' : 'outlined'}
        sx={{
          background: filters?.status?.includes('Updates Required') ? MthColor.BUTTON_LINEAR_GRADIENT : '',
          color: filters?.status?.includes('Updates Required') ? 'white' : MthColor.BLACK,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Updates Required')}
      >
        Updates Required ({(scheduleCount && scheduleCount['Updates Required']) || 0})
      </Button>
      <Button
        variant={filters?.status?.includes('Not Submitted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters?.status?.includes('Not Submitted') ? MthColor.BUTTON_LINEAR_GRADIENT : '',
          color: filters?.status?.includes('Not Submitted') ? 'white' : MthColor.BLACK,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Not Submitted')}
      >
        Not Submitted ({(scheduleCount && scheduleCount['Not Submitted']) || 0})
      </Button>
      <Button
        variant={filters?.status?.includes('Accepted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters?.status?.includes('Accepted') ? MthColor.BUTTON_LINEAR_GRADIENT : '',
          color: filters?.status?.includes('Accepted') ? 'white' : MthColor.BLACK,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Accepted')}
      >
        Accepted ({(scheduleCount && scheduleCount['Accepted']) || 0})
      </Button>
    </Box>
  )
}
