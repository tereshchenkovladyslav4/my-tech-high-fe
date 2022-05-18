import { Box, Grid } from '@mui/material'
import React from 'react'
import { CalendarTable } from './CalendarTable'

const Calendar = () => {
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <CalendarTable />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Calendar
