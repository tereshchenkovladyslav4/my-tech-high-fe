import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { AddEvent } from './AddEvent'
import { EditType } from './EditType'
import { MainComponent } from './MainComponent'
import { EventVM } from './types'

const Calendar: React.FC = () => {
  const isExact = useRouteMatch(MthRoute.CALENDAR)?.isExact
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
        <Route exact path={`${MthRoute.CALENDAR}/editType`}>
          <EditType />
        </Route>
        <Route exact path={`${MthRoute.CALENDAR}/addEvent`}>
          <AddEvent selectedEvent={event} />
        </Route>
      </Switch>
    </Box>
  )
}

export default Calendar
