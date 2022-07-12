import { Box, Card, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'
import { EventCalendar } from './EventCalendar'
import { EventDetail } from './EventDetail'
import { HeaderComponent } from './HeaderComponent'
import { useStyles } from './styles'
import { FullCalendarProps } from './types'

const FullCalendar = ({ events, calendarEventList, eventTypeLists, setEvents, setSectionName }: FullCalendarProps) => {
  const classes = useStyles
  const [searchField, setSearchField] = useState<string | undefined>('')
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0)
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([])

  useEffect(() => {
    setSelectedEventTypes(eventTypeLists.map((eventType) => eventType.name))
  }, [eventTypeLists])

  return (
    <Card sx={classes.cardBody}>
      <HeaderComponent
        searchField={searchField}
        setSearchField={setSearchField}
        eventTypeLists={eventTypeLists}
        selectedEventTypes={selectedEventTypes}
        setSelectedEventTypes={setSelectedEventTypes}
        setSectionName={setSectionName}
      />
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <EventDetail
              selectedEventIds={selectedEventIds}
              events={events?.filter((event: EventVM) => selectedEventTypes.includes(event?.eventTypeName || ''))}
              setEvents={setEvents}
              selectedEventIndex={selectedEventIndex}
              setSelectedEventIndex={setSelectedEventIndex}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <EventCalendar
              setSelectedEventIds={setSelectedEventIds}
              events={events?.filter((event: EventVM) => selectedEventTypes.includes(event?.eventTypeName || ''))}
              setSelectedEventIndex={setSelectedEventIndex}
              eventList={calendarEventList?.filter((list: CalendarEvent) => selectedEventTypes.includes(list?.title))}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default FullCalendar
