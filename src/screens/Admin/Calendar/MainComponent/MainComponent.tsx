import { Box, Card, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useStyles } from './styles'
import { CalendarComponent } from '../CalendarComponent'
import { HeaderComponent } from '../HeaderComponent'
import { EventComponent } from '../EventComponent'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { useQuery } from '@apollo/client'
import { getEventsQuery } from '../EditTypeComponent/services'
import { CalendarEvent, EventResponseVM, EventVM, MainComponentProps } from '../types'
const MainComponent = ({ setEvent }: MainComponentProps) => {
  const classes = useStyles
  const [searchField, setSearchField] = useState<string | undefined>('')
  const { me } = useContext(UserContext)
  const [calendarEventList, setCalendarEventList] = useState<CalendarEvent[]>([])
  const [events, setEvents] = useState<EventVM[]>([])

  const { loading, data, refetch } = useQuery(getEventsQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const hexToRgbA = (hexColor: string) => {
    let c: any
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
      c = hexColor.substring(1).split('')
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.2)'
    }
    throw new Error('Bad Hex')
  }

  useEffect(() => {
    if (!loading && data?.eventsByRegionId) {
      const eventLists = data?.eventsByRegionId
      setCalendarEventList(
        eventLists.map((event: EventResponseVM) => ({
          id: event.event_id,
          title: event.EventType.name,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          color: event.EventType.color,
          backgroundColor: hexToRgbA(event.EventType.color || ''),
          allDay: true,
        })),
      )
      setEvents(
        eventLists.map((event: EventResponseVM) => ({
          eventId: event.event_id,
          title: event.title,
          eventTypeId: event.TypeId,
          eventTypeColor: event.EventType.color,
          eventTypeName: event.EventType.name,
          startDate: event.start_date,
          endDate: event.end_date,
          time: event.time,
          description: event.description,
          filters: {
            grades: event.filter_grades,
            other: event.filter_other,
            programYear: event.filter_program_year,
            provider: event.filter_provider,
            schoolOfEnrollment: event.filter_school_of_enrollment,
            users: event.fitler_users,
          },
        })),
      )
    } else {
      setCalendarEventList([])
      setEvents([])
      setEvent(undefined)
    }
  }, [data])

  return (
    <Card sx={classes.cardBody}>
      <HeaderComponent searchField={searchField} setSearchField={setSearchField} />
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <EventComponent events={events} setEvents={setEvents} setEvent={setEvent} refetch={refetch} />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <CalendarComponent eventList={calendarEventList} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default MainComponent
