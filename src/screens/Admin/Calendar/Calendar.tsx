import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { CALENDAR } from '../../../utils/constants'
import { AddEventComponent } from './AddEventComponent'
import { MainComponent } from './MainComponent'
import { EditTypeComponent } from './EditTypeComponent'
import { EventVM } from './types'

const Calendar = () => {
  const isExact = useRouteMatch(CALENDAR)?.isExact
  const [event, setEvent] = useState<EventVM>()
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          {isExact && <MainComponent setEvent={setEvent} />}
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`${CALENDAR}/editType`}>
          <EditTypeComponent />
        </Route>
        <Route exact path={`${CALENDAR}/addEvent`}>
          <AddEventComponent selectedEvent={event} />
        </Route>
      </Switch>
    </Box>
  )
}

export default Calendar
