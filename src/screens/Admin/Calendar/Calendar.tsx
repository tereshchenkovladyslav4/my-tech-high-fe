import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { CALENDAR } from '../../../utils/constants'
import { AddEventComponent } from './AddEventComponent'
import { MainComponent } from './MainComponent'
import { EditTypeComponent } from './EditTypeComponent'
import { RSVPComponent } from './RSVPComponent'

const Calendar = () => {
  const { isExact } = useRouteMatch(CALENDAR)
  const [previousPage, setPreviousPage] = useState<string>('/')
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          {isExact && <MainComponent />}
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`${CALENDAR}/editType`}>
          <EditTypeComponent />
        </Route>
        <Route exact path={`${CALENDAR}/addEvent`}>
          <AddEventComponent setPreviousPage={setPreviousPage} />
        </Route>
        <Route exact path={`${CALENDAR}/rsvp`}>
          <RSVPComponent previousPage={previousPage} />
        </Route>
      </Switch>
    </Box>
  )
}

export default Calendar
