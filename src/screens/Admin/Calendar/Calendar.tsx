import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { CALENDAR } from '../../../utils/constants'
import { CalendarTable } from './CalendarTable'
import { EditTypeComponent } from './EditTypeComponent'

const Calendar = () => {
  const { isExact } = useRouteMatch(CALENDAR)
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          {isExact && <CalendarTable />}
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`${CALENDAR}/editType`}>
          <EditTypeComponent />
        </Route>
      </Switch>
    </Box>
  )
}

export default Calendar
