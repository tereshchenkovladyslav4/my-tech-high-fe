import React, { Children, useState } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Box, Button } from '@mui/material'
import { useStyles } from '../MainComponent/styles'
import { CalendarComponentProps } from '../types'

moment.locale('ko', {
  week: {
    dow: 1,
    doy: 1,
  },
})
const localizer = momentLocalizer(moment)

const CalendarComponent = ({ eventList }: CalendarComponentProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const classes = useStyles

  const Event = ({ event }: any) => {
    return (
      <span style={{ color: event.color }}>
        <strong>{event.title}</strong>
      </span>
    )
  }

  const ColoredDateCellWrapper = ({ children, value }: any) =>
    React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        backgroundColor: value > new Date(2021, 2, 0) && value < new Date(2021, 2, 2) ? '#EEF4F8' : 'white',
      },
    })

  const formats = {
    weekdayFormat: (date: any, culture: any, localizer: any) => localizer.format(date, 'dd', culture),
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
        style={{ minHeight: 730 }}
        defaultDate={selectedDate}
        date={selectedDate}
        formats={formats}
        eventPropGetter={(event: any, start: any, end: any, isSelected: any) => ({
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
