import React, { Children, useState } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Card, Fade, Popper } from '@mui/material'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { mainClasses } from '../../../Admin/Calendar/MainComponent/styles'
import { CalendarEvent, EventCalendarProps } from '../../../Admin/Calendar/types'
import { calendarDayClassess } from '../../ParentCalendar/components/styles'

moment.locale('en', {
  week: {
    dow: 1,
    doy: 1,
  },
})
const localizer = momentLocalizer(moment)

const EventCalendar: React.FC<EventCalendarProps> = ({
  eventList,
  selectedDate,
  selectedEvent,
  currentMonth,
  setCurrentMonth,
  setSelectedEventId,
  setSelectedDate,
}) => {
  const [showMore, setShowMore] = useState<boolean>(false)
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const Event = ({ event }: unknown) => {
    return (
      <span style={{ color: event.color }}>
        <strong>{event.title}</strong>
      </span>
    )
  }

  const ColoredDateCellWrapper = ({ children, value }: unknown) =>
    React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        backgroundColor: value > new Date(2021, 2, 0) && value < new Date(2021, 2, 2) ? '#EEF4F8' : 'white',
      },
    })

  const formats = {
    weekdayFormat: (date: unknown, culture: unknown, localizer: unknown) => localizer.format(date, 'dd', culture),
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    eventList.forEach((item) => {
      if (item.id == event.id) {
        setSelectedDate(undefined)
        setSelectedEventId(event.id)
      }
    })
  }

  const renderEventList = (eventList: CalendarEvent[]) => {
    return eventList?.map((event, index) => {
      return (
        <Box key={index} display={'grid'} alignItems={'center'}>
          <Button
            sx={{
              mt: 1.5,
              background: event.backgroundColor,
              width: '100%',
              border: event.id == selectedEvent?.eventId ? `1px solid ${event.color}` : 'none',
            }}
            onClick={() => setTimeout(() => setSelectedEventId(event.id), 100)}
          >
            <Subtitle color={event.color} fontWeight='600' sx={{ fontSize: '12px' }}>
              {event.title}
            </Subtitle>
          </Button>
        </Box>
      )
    })
  }
  const handleOnNaviate = () => {}

  const CustomToolbar = () => {
    return (
      <Box className='toolbar-container'>
        <Box style={{ display: 'flex', marginBottom: '20px' }}>
          <Button
            disableElevation
            variant='contained'
            sx={mainClasses.leftArrowButton}
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => {
              if (currentMonth.getMonth() == 0) {
                setCurrentMonth(new Date(currentMonth.getFullYear() - 1, 11, 1))
              } else {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
              }
            }}
          ></Button>
          <label style={{ marginBottom: 'auto', marginTop: 'auto' }}>{moment(currentMonth).format('MMMM YYYY')}</label>
          <Button
            disableElevation
            variant='contained'
            sx={mainClasses.rightArrowButton}
            startIcon={<ArrowForwardIosIcon />}
            onClick={() => {
              if (currentMonth.getMonth() == 11) {
                setCurrentMonth(new Date(currentMonth.getFullYear() + 1, 0, 1))
              } else {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
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
        views={{ month: true }}
        events={eventList}
        startAccessor='start'
        endAccessor='end'
        style={{ minHeight: 730 }}
        defaultDate={currentMonth}
        date={currentMonth}
        formats={formats}
        onSelectEvent={handleSelectEvent}
        selectable
        popup={false}
        onNavigate={handleOnNaviate}
        messages={{
          showMore: (target: number) => (
            <span
              className='ml-2'
              role='presentation'
              onClick={(e) => {
                setShowMore(true)
                setAnchorEl(e?.currentTarget)
              }}
            >
              +{target} more
            </span>
          ),
        }}
        onShowMore={(events, date) => {
          setSelectedEvents(events)
          setSelectedDate(date)
          setSelectedEventId(0)
        }}
        onSelectSlot={(slotInfo) => {
          const { start } = slotInfo
          setSelectedDate(start)
          setSelectedEventId(0)
          setShowMore(false)
          setAnchorEl(null)
        }}
        eventPropGetter={(event: unknown, start: unknown, end: unknown, isSelected: unknown) => ({
          event,
          start,
          end,
          isSelected,
          style: {
            backgroundColor: event.backgroundColor,
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'left',
            outline: 'none',
            ...(isSelected && {
              border: `1px solid ${event.color}`,
            }),
          },
        })}
        components={{
          event: Event,
          toolbar: CustomToolbar,
          dateCellWrapper: ColoredDateCellWrapper,
        }}
      />
      <Popper id={'simple-popper'} open={showMore} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card sx={calendarDayClassess.modal}>
              <Box sx={calendarDayClassess.title}>
                <Subtitle color={MthColor.GRAY} sx={{ fontSize: '20px' }} fontWeight='700'>
                  {moment(selectedDate).format('dddd')}
                </Subtitle>
                <CloseIcon
                  sx={calendarDayClassess.closeBtn}
                  onClick={() => {
                    setAnchorEl(null)
                    setShowMore(false)
                  }}
                />
              </Box>
              <Subtitle color={MthColor.BLACK} sx={{ fontSize: '20px', textAlign: 'center' }} fontWeight='700'>
                {moment(selectedDate).format('D')}
              </Subtitle>
              <Box sx={{ paddingX: 2, paddingBottom: 2 }}>{renderEventList(selectedEvents)}</Box>
            </Card>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}

export default EventCalendar
