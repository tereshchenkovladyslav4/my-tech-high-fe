import React, { Children, useState } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, ButtonGroup } from '@mui/material'
import { useStyles } from '../CalendarTable/styles'

moment.locale('ko', {
  week: {
    dow: 1,
    doy: 1,
  },
})
const localizer = momentLocalizer(moment)

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2021, 2, 1))
  const classes = useStyles
  const myEventsList = [
    {
      id: 0,
      title: 'Club',
      allDay: true,
      start: new Date(2021, 2, 1),
      end: new Date(2021, 2, 1),
      color: '#2B9EB7',
      backgroundColor: '#EEF4F8',
    },
    {
      id: 1,
      title: 'Field Trip',
      start: new Date(2021, 2, 2),
      end: new Date(2021, 2, 2),
      color: '#7B61FF',
      backgroundColor: '#FFFFFF',
    },

    {
      id: 2,
      title: 'Deadline',
      start: new Date(2021, 2, 2),
      end: new Date(2021, 2, 2),
      color: '#EC5925',
      backgroundColor: '#FFFFFF',
    },
  ]

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
      <div className='toolbar-container'>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
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
        </div>
      </div>
    )
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
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
    </div>
  )
}

export default CalendarComponent
