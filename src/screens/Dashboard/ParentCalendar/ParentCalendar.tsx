import React, { useEffect, useState } from 'react'
import { Box, Card, Divider, Grid } from '@mui/material'
import moment from 'moment'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { DashboardCalendar } from './components/DashboardCalendar'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'
import { ParentEventDetail } from './ParentEventDetail'
import { ParentCalendarTemplateType } from './types'
import { parentCalendarClasses } from './styles'

const ParentCalendar: ParentCalendarTemplateType = ({ events, calendarEventList, eventTypeLists, setSectionName }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0)

  const handlePrevEventView = () => {
    const filteredEvents = getFilteredEvents(selectedDate)
    if (selectedEventIndex - 1 >= 0) {
      setSelectedEventIndex(selectedEventIndex - 1)
      setSelectedEvent(filteredEvents?.at(selectedEventIndex - 1))
    }
  }

  const handleNextEventView = () => {
    const filteredEvents = getFilteredEvents(selectedDate)
    if (selectedEventIndex + 1 < filteredEvents?.length) {
      setSelectedEventIndex(selectedEventIndex + 1)
      setSelectedEvent(filteredEvents?.at(selectedEventIndex + 1))
    }
  }

  const getFilteredEvents = (selectedDate: Date | undefined) => {
    return selectedDate
      ? events?.filter(
          (event) =>
            moment(event.startDate).format('YYYY-MM-DD') <= moment(selectedDate).format('YYYY-MM-DD') &&
            moment(event.endDate).format('YYYY-MM-DD') >= moment(selectedDate).format('YYYY-MM-DD') &&
            selectedEventTypes.includes(event.eventTypeName),
        )
      : events.filter((event) => selectedEventTypes.includes(event.eventTypeName))
  }

  const handleSelectedEvent = (slotInfo: CalendarEvent, date: Date) => {
    const filteredEvents = getFilteredEvents(date)
    const index = filteredEvents.findIndex((item) => item.eventId === slotInfo.id)
    setSelectedEventIndex(index)
    setSelectedEvent(filteredEvents[index])
  }

  const handleRSVPClick = () => {}

  useEffect(() => {
    setSelectedEventTypes(eventTypeLists.map((eventType) => eventType.name))
  }, [eventTypeLists])

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    setSelectedEventIndex(0)
    setSelectedEvent(filteredEvents.at(0))
  }, [selectedDate, selectedEventTypes, events])

  return (
    <Card style={{ borderRadius: 12 }}>
      <Box flexDirection='column' textAlign='left' paddingY={3} paddingX={3} display={{ xs: 'none', sm: 'flex' }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={4}>
            <Subtitle
              size='large'
              fontWeight='bold'
              sx={{ cursor: 'pointer' }}
              onClick={() => setSectionName('fullCalendar')}
            >
              Calendar
            </Subtitle>
            {selectedEvent && (
              <ParentEventDetail
                selectedEvent={selectedEvent}
                setSectionName={setSectionName}
                handleRSVPClick={handleRSVPClick}
                handlePrevEventView={handlePrevEventView}
                handleNextEventView={handleNextEventView}
              />
            )}
          </Grid>
          <Grid item xs={2}>
            <Divider orientation='vertical' style={parentCalendarClasses.divider} />
          </Grid>
          <Grid item xs={6} sx={{ zIndex: 0 }}>
            <DashboardCalendar
              selectedEvent={selectedEvent}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarEventList={calendarEventList}
              selectedEventTypes={selectedEventTypes}
              eventTypeLists={eventTypeLists}
              setSelectedEventTypes={setSelectedEventTypes}
              handleSelectedEvent={handleSelectedEvent}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default ParentCalendar
