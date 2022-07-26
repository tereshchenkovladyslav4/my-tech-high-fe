import React, { Children, useState } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Box, Button, Card, Fade, Popper } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { mainClasses } from '../../../Admin/Calendar/MainComponent/styles'
import { CalendarEvent, EventCalendarProps } from '../../../Admin/Calendar/types'
import { calendarDayClassess } from '../../ParentCalendar/components/styles'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BLACK, GRAY } from '../../../../utils/constants'

moment.locale('en', {
  week: {
    dow: 1,
    doy: 1,
  },
})
const localizer = momentLocalizer(moment)

const EventCalendar = ({
  eventList,
  selectedDate,
  selectedEvent,
  setSelectedEventId,
  setSelectedDate,
}: EventCalendarProps) => {
  const [currentDay, setCurrentDay] = useState(new Date())
  const [showMore, setShowMore] = useState<boolean>(false)
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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
              if (currentDay.getMonth() == 0) {
                setCurrentDay(new Date(currentDay.getFullYear() - 1, 11, 1))
              } else {
                setCurrentDay(new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1))
              }
            }}
          ></Button>
          <label style={{ marginBottom: 'auto', marginTop: 'auto' }}>{moment(currentDay).format('MMMM YYYY')}</label>
          <Button
            disableElevation
            variant='contained'
            sx={mainClasses.rightArrowButton}
            startIcon={<ArrowForwardIosIcon />}
            onClick={() => {
              if (currentDay.getMonth() == 11) {
                setCurrentDay(new Date(currentDay.getFullYear() + 1, 0, 1))
              } else {
                setCurrentDay(new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1))
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
        defaultDate={currentDay}
        date={currentDay}
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
        }}
        onSelectSlot={(slotInfo) => {
          const { start } = slotInfo
          setSelectedDate(start)
          setShowMore(false)
          setAnchorEl(null)
        }}
        eventPropGetter={(event: any, start: any, end: any, isSelected: any) => ({
          event,
          start,
          end,
          isSelected,
          style: {
            backgroundColor: event.backgroundColor,
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
                <Subtitle color={GRAY} sx={{ fontSize: '20px' }} fontWeight='500'>
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
              <Subtitle color={BLACK} sx={{ fontSize: '20px', textAlign: 'center' }} fontWeight='700'>
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
