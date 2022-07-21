import React, { useEffect, useState } from 'react'
import { Box, Card, Grid } from '@mui/material'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'
import { EventCalendar } from './EventCalendar'
import { EventDetail } from './EventDetail'
import { HeaderComponent } from './HeaderComponent'
import { FullCalendarProps } from './types'

const FullCalendar = ({
  searchField,
  events,
  calendarEventList,
  eventTypeLists,
  setSearchField,
  setSectionName,
}: FullCalendarProps) => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0)
  const [selectedEventId, setSelectedEventId] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()

  useEffect(() => {
    setSelectedEventTypes(eventTypeLists.map((eventType) => eventType.name))
  }, [eventTypeLists])

  return (
    <Card
      sx={{
        marginTop: 2,
        marginX: 4,
        paddingTop: '24px',
        marginBottom: '24px',
        paddingBottom: '12px',
      }}
    >
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
              selectedEvent={selectedEvent}
              selectedEventId={selectedEventId}
              selectedDate={selectedDate}
              events={events?.filter((event: EventVM) => selectedEventTypes.includes(event?.eventTypeName || ''))}
              selectedEventIndex={selectedEventIndex}
              setSelectedEventIndex={setSelectedEventIndex}
              setSelectedEvent={setSelectedEvent}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8} sx={{ zIndex: 0 }}>
            <EventCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedEventId={setSelectedEventId}
              selectedEvent={selectedEvent}
              eventList={calendarEventList?.filter((list: CalendarEvent) => selectedEventTypes.includes(list?.title))}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default FullCalendar
