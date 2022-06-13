import React, { Children, useContext, useEffect, useState } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Box, Button, ButtonGroup } from '@mui/material'
import { useStyles } from '../MainComponent/styles'
import { useQuery } from '@apollo/client'
import { getEventsQuery } from '../EditTypeComponent/services'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { CalendarEvent } from '../types'

moment.locale('ko', {
  week: {
    dow: 1,
    doy: 1,
  },
})
const localizer = momentLocalizer(moment)

const CalendarComponent = () => {
  const { me } = useContext(UserContext)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const classes = useStyles
  const [eventList, setEventList] = useState<CalendarEvent[]>([])
  const { loading, data, refetch } = useQuery(getEventsQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!loading && data?.eventsByRegionId) {
      const eventLists = data?.eventsByRegionId
      setEventList(
        eventLists.map((event) => ({
          id: event.event_id,
          title: event.EventType.name,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          color: event.EventType.color,
          backgroundColor: '#FFFFFF',
        })),
      )
    }
  }, [data])

  const Event = ({ event }) => {
    return (
      <span style={{ color: event.color }}>
        <strong>{event.title}</strong>
      </span>
    )
  }

  const ColoredDateCellWrapper = ({ children, value }) =>
    React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        backgroundColor: value > new Date(2021, 2, 0) && value < new Date(2021, 2, 2) ? '#EEF4F8' : 'white',
      },
    })

  const formats = {
    weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dd', culture),
  }

  const CustomToolbar = () => {
    return (
      <Box className='toolbar-container'>
        <Box style={{ display: 'flex', marginBottom: '20px' }}>
          <Button
            disableElevation
            variant='contained'
            sx={classes.leftArrowButton}
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => {
              if (selectedDate.getMonth() == 0) {
                setSelectedDate(new Date(selectedDate.getFullYear() - 1, 11, 1))
              } else {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
              }
            }}
          ></Button>
          <label style={{ marginBottom: 'auto', marginTop: 'auto' }}>{moment(selectedDate).format('MMMM YYYY')}</label>
          <Button
            disableElevation
            variant='contained'
            sx={classes.rightArrowButton}
            startIcon={<ArrowForwardIosIcon />}
            onClick={() => {
              if (selectedDate.getMonth() == 11) {
                setSelectedDate(new Date(selectedDate.getFullYear() + 1, 0, 1))
              } else {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
              }
            }}
          ></Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 600 }}
        defaultDate={selectedDate}
        date={selectedDate}
        formats={formats}
        eventPropGetter={(event, start, end, isSelected) => ({
          event,
          start,
          end,
          isSelected,
          style: { backgroundColor: event.backgroundColor, textAlign: 'left' },
        })}
        components={{
          event: Event,
          toolbar: CustomToolbar,
          dateCellWrapper: ColoredDateCellWrapper,
        }}
      />
    </Box>
  )
}

export default CalendarComponent
