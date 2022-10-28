import React, { useState } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Filters } from './Filters/Filters'
import { ScheduleTable } from './ScheduleTable/ScheduleTable'
import { FilterVM } from './type'

export const EnrollmentSchedule: React.FC = () => {
  const [filter, setFilter] = useState<FilterVM>()
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Filters filter={filter} setFilter={setFilter} />
        </Grid>
        <Grid item xs={12}>
          <ScheduleTable filter={filter} />
        </Grid>
      </Grid>
    </Box>
  )
}
