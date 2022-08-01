import React, { useContext, useEffect, useState } from 'react'
import { Box, Card, Grid } from '@mui/material'
import { useEventsByRegionIdAndFilterItem, useEventTypeListByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { EventCalendar } from '../EventCalendar'
import { EventDetail } from '../EventDetail'
import { HeaderComponent } from '../HeaderComponent'
import { CalendarEvent, EventVM, MainComponentProps } from '../types'
import { mainClasses } from './styles'

const MainComponent = ({ selectedEventIndex, setSelectedEventIndex, setEvent }: MainComponentProps) => {
  const [searchField, setSearchField] = useState<string | undefined>('')
  const { me } = useContext(UserContext)
  const {
    loading: EventsLoading,
    calendarEventList,
    events,
    refetch,
  } = useEventsByRegionIdAndFilterItem(Number(me?.selectedRegionId))
  const { data: eventTypeLists, loading: eventTypeLoading } = useEventTypeListByRegionId(Number(me?.selectedRegionId))
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  useEffect(() => {
    if (!EventsLoading && calendarEventList.length === 0) {
      setEvent(undefined)
    }
  }, [EventsLoading, calendarEventList])

  useEffect(() => {
    if (eventTypeLists && !eventTypeLoading) {
      setSelectedEventTypes(eventTypeLists.map((eventType) => eventType.name))
    }
  }, [eventTypeLists, eventTypeLoading])

  return (
    <Card sx={mainClasses.cardBody}>
      <HeaderComponent
        searchField={searchField}
        setSearchField={setSearchField}
        eventTypeLists={eventTypeLists}
        selectedEventTypes={selectedEventTypes}
        setSelectedEventTypes={setSelectedEventTypes}
      />
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <EventDetail
              currentMonth={currentMonth}
              selectedEvent={selectedEvent}
              selectedEventId={selectedEventId}
              selectedDate={selectedDate}
              events={events?.filter((event: EventVM) => selectedEventTypes.includes(event?.eventTypeName || ''))}
              selectedEventIndex={selectedEventIndex}
              setSelectedEvent={setSelectedEvent}
              setSelectedEventIndex={setSelectedEventIndex}
              setEvent={setEvent}
              refetch={refetch}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8} sx={{ zIndex: 0 }}>
            <EventCalendar
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              selectedDate={selectedDate}
              selectedEvent={selectedEvent}
              setSelectedDate={setSelectedDate}
              setSelectedEventId={setSelectedEventId}
              eventList={calendarEventList?.filter((list: CalendarEvent) => selectedEventTypes.includes(list?.title))}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default MainComponent
