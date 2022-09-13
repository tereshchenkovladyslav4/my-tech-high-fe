import React, { useEffect, useState } from 'react'
import { Box, Button, Card, Divider, Grid } from '@mui/material'
import moment from 'moment'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { getFirstDayAndLastDayOfMonth } from '@mth/utils'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'
import { DashboardCalendar } from './components/DashboardCalendar'
import { ParentEventDetail } from './ParentEventDetail'
import { parentCalendarClasses } from './styles'
import { ParentCalendarProps } from './types'

const ParentCalendar: React.FC<ParentCalendarProps> = ({
  events,
  calendarEventList,
  eventTypeLists,
  setSectionName,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [firstDay, setFirstDay] = useState<Date>()
  const [lastDay, setLastDay] = useState<Date>()

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
      : events.filter(
          (event) =>
            selectedEventTypes.includes(event.eventTypeName) &&
            ((moment(firstDay).format('YYYY-MM-DD') <= moment(event.startDate).format('YYYY-MM-DD') &&
              moment(lastDay).format('YYYY-MM-DD') >= moment(event.startDate).format('YYYY-MM-DD')) ||
              (moment(firstDay).format('YYYY-MM-DD') <= moment(event.endDate).format('YYYY-MM-DD') &&
                moment(lastDay).format('YYYY-MM-DD') >= moment(event.endDate).format('YYYY-MM-DD'))),
        )
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
  }, [selectedDate, selectedEventTypes, events, firstDay, lastDay])

  useEffect(() => {
    const { firstDay: first, lastDay: last } = getFirstDayAndLastDayOfMonth(currentMonth)
    setFirstDay(first)
    setLastDay(last)
  }, [currentMonth])

  return (
    <Card style={{ borderRadius: 12 }}>
      <Box sx={{ flexDirection: 'column', textAlign: 'left', paddingY: 3, paddingX: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={12} lg={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Subtitle
                size='large'
                fontWeight='bold'
                sx={{ cursor: 'pointer' }}
                onClick={() => setSectionName('fullCalendar')}
              >
                Calendar
              </Subtitle>
              <Box display={{ xs: 'block', sm: 'block', md: 'none' }}>
                <Button>
                  <Paragraph
                    size='medium'
                    sx={{ textDecoration: 'underline' }}
                    color={MthColor.MTHBLUE}
                    onClick={() => setSectionName('fullCalendar')}
                  >
                    View All
                  </Paragraph>
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} lg={4} order={{ xs: 3, lg: 1 }} sx={{ marginTop: 3 }}>
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
          <Grid item xs={12} lg={2} order={{ xs: 2, lg: 2 }} display={{ xs: 'none', sm: 'none', md: 'block' }}>
            <Divider orientation='vertical' style={parentCalendarClasses.divider} />
          </Grid>
          <Grid item xs={12} lg={6} sx={{ zIndex: 0, marginY: 2 }} order={{ xs: 1, lg: 3 }}>
            <DashboardCalendar
              currentMonth={currentMonth}
              selectedEvent={selectedEvent}
              selectedDate={selectedDate}
              calendarEventList={calendarEventList}
              selectedEventTypes={selectedEventTypes}
              eventTypeLists={eventTypeLists}
              setSelectedDate={setSelectedDate}
              setCurrentMonth={setCurrentMonth}
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
