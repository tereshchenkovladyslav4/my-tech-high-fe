import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { CALENDAR } from '../../../utils/constants'
import { AddEvent } from './AddEvent'
import { MainComponent } from './MainComponent'
import { EditType } from './EditType'
import { EventVM } from './types'

const Calendar = () => {
  const isExact = useRouteMatch(CALENDAR)?.isExact
  const [event, setEvent] = useState<EventVM>()
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0)
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          {isExact && (
            <MainComponent
              selectedEventIndex={selectedEventIndex}
              setSelectedEventIndex={setSelectedEventIndex}
              setEvent={setEvent}
            />
          )}
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`${CALENDAR}/editType`}>
          <EditType />
        </Route>
        <Route exact path={`${CALENDAR}/addEvent`}>
          <AddEvent selectedEvent={event} />
        </Route>
      </Switch>
    </Box>
  )
}

export default Calendar
