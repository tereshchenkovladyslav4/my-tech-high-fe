import React, { FunctionComponent, useEffect, useState } from 'react'
import { Box, Button, Card, Divider, Grid } from '@mui/material'
import { useStyles } from './styles'
import { DashboardCalendar } from './components/DashboardCalendar'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import moment from 'moment'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { CalendarEvent, EventVM } from '../../Admin/Calendar/types'
import { MTHGREEN, SYSTEM_05, SYSTEM_02, SYSTEM_06, GRADES } from '../../../utils/constants'
import { MultiSelectDropDownListType } from '../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { extractContent } from '../../../utils/utils'
type ParentCalendarProps = {
  events: EventVM[]
  calendarEventList: CalendarEvent[]
  eventTypeLists: MultiSelectDropDownListType[]
  setSectionName: (value: string) => void
}
const ParentCalendar: FunctionComponent<ParentCalendarProps> = ({
  events,
  calendarEventList,
  eventTypeLists,
  setSectionName,
}) => {
  const classes = useStyles
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0)

  const handlePrevEventView = () => {
    const filteredEvents = getFilteredEvents()
    console.log(filteredEvents, 'filteredEvents', selectedDate)
    if (selectedEventIndex - 1 >= 0) {
      setSelectedEventIndex(selectedEventIndex - 1)
      setSelectedEvent(filteredEvents?.at(selectedEventIndex - 1))
    }
  }

  const handleNextEventView = () => {
    let filteredEvents = getFilteredEvents()
    console.log(filteredEvents, 'filteredEvents', selectedDate)
    if (selectedEventIndex + 1 < filteredEvents?.length) {
      setSelectedEventIndex(selectedEventIndex + 1)
      setSelectedEvent(filteredEvents?.at(selectedEventIndex + 1))
    }
  }

  const getFilteredEvents = () => {
    return selectedDate
      ? events?.filter(
          (event) =>
            moment(event.startDate).format('YYYY-MM-DD') <= moment(selectedDate).format('YYYY-MM-DD') &&
            moment(event.endDate).format('YYYY-MM-DD') >= moment(selectedDate).format('YYYY-MM-DD') &&
            selectedEventTypes.includes(event.eventTypeName),
        )
      : events.filter((event) => selectedEventTypes.includes(event.eventTypeName))
  }

  const handelSelectedEvent = (slotInfo: CalendarEvent) => {
    const filteredEvents = getFilteredEvents()
    const index = filteredEvents.findIndex((item) => item.eventId === slotInfo.id)
    setSelectedEventIndex(index)
    setSelectedEvent(filteredEvents[index])
  }

  const handleRSVPClick = () => {}

  const renderFilter = (): string => {
    let grades = ''
    if (selectedEvent?.filters?.grades) {
      grades = GRADES.map((item) => {
        if (
          JSON.parse(selectedEvent?.filters?.grades)
            .filter((item: string) => item != 'all')
            .includes(`${item}`)
        ) {
          return item
        }
      })
        .filter((item) => item)
        .join(',')
    }
    return grades
  }

  const renderDate = (): string => {
    return !selectedEvent?.allDay
      ? moment(selectedEvent?.startDate).format('MMMM DD') == moment(selectedEvent?.endDate).format('MMMM DD')
        ? `${moment(selectedEvent?.startDate).format('hh:mm A')}, ${moment(selectedEvent?.startDate).format('MMMM DD')}`
        : `${moment(selectedEvent?.startDate).format('hh:mm A')}, ${moment(selectedEvent?.startDate).format(
            'MMMM DD',
          )} - ${moment(selectedEvent?.endDate).format('MMMM DD')}`
      : moment(selectedEvent?.startDate).format('MMMM DD') == moment(selectedEvent?.endDate).format('MMMM DD')
      ? `${moment(selectedEvent?.startDate).format('MMMM DD')}`
      : `${moment(selectedEvent?.startDate).format('MMMM DD')} - ${moment(selectedEvent?.endDate).format('MMMM DD')}`
  }

  useEffect(() => {
    setSelectedEventTypes(eventTypeLists.map((eventType) => eventType.name))
  }, [eventTypeLists])

  useEffect(() => {
    const filteredEvents = getFilteredEvents()
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
              <>
                <Button sx={classes.clubButton}>
                  <Subtitle color={MTHGREEN} size={19} fontWeight='500'>
                    {selectedEvent?.eventTypeName}
                  </Subtitle>
                </Button>
                <Subtitle size='medium' fontWeight='500' sx={{ my: 1.5 }} color={SYSTEM_02}>
                  {selectedEvent?.title}
                </Subtitle>
                <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ display: 'inline-block' }}>
                  {renderDate()}
                </Subtitle>
                <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ marginTop: 1 }}>
                  {renderFilter()}
                </Subtitle>
                <Subtitle size={12} fontWeight='500' color={SYSTEM_05} sx={{ mt: 2 }}>
                  {extractContent(selectedEvent?.description)}
                  <a
                    style={classes.readMore}
                    onClick={() => {
                      setSectionName('fullCalendar')
                    }}
                  >
                    Read More
                  </a>
                </Subtitle>
                <Box sx={classes.arrowButtonGroup} display={{ xs: 'none', sm: 'flex' }}>
                  <Button sx={classes.saveBtn} onClick={() => handleRSVPClick()}>
                    RSVP
                  </Button>
                  <Button
                    disableElevation
                    variant='contained'
                    sx={classes.arrowButton}
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={() => handlePrevEventView()}
                  ></Button>
                  <Button
                    disableElevation
                    variant='contained'
                    sx={classes.arrowButton}
                    startIcon={<ArrowForwardIosIcon />}
                    onClick={() => handleNextEventView()}
                  ></Button>
                </Box>
              </>
            )}
          </Grid>
          <Grid item xs={2}>
            <Divider orientation='vertical' style={classes.divider} />
          </Grid>
          <Grid item xs={6}>
            <DashboardCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarEventList={calendarEventList}
              selectedEventTypes={selectedEventTypes}
              eventTypeLists={eventTypeLists}
              setSelectedEventTypes={setSelectedEventTypes}
              selectedEvent={handelSelectedEvent}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default ParentCalendar
