import React, { useContext, useEffect } from 'react'
import { Avatar, AvatarGroup, Box, Button, Stack } from '@mui/material'
import { useHistory } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import moment from 'moment'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR, SYSTEM_02, SYSTEM_05, SYSTEM_06 } from '../../../../utils/constants'
import { EventDetailProps } from '../types'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Person } from '../../../HomeroomStudentProfile/Student/types'
import { extractContent, renderDate, renderFilter } from '../../../../utils/utils'
import { eventDetailClassess } from './styles'

const EventDetail = ({
  events,
  selectedEventIndex,
  selectedDate,
  selectedEventId,
  selectedEvent,
  setSelectedEventIndex,
  setSelectedEvent,
}: EventDetailProps) => {
  const history = useHistory()
  const { me } = useContext(UserContext)
  const students = me?.students

  const handleRSVPClick = () => {
    history.push(`${CALENDAR}/rsvp`)
  }

  const getFilteredEvents = (selectedDate: Date | undefined) => {
    return !!selectedDate
      ? events?.filter(
          (event) =>
            moment(event.startDate).format('YYYY-MM-DD') <= moment(selectedDate).format('YYYY-MM-DD') &&
            moment(event.endDate).format('YYYY-MM-DD') >= moment(selectedDate).format('YYYY-MM-DD'),
        )
      : events
  }

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

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const avatarGroup = (gradeFilter: string) => {
    const grades = JSON.parse(gradeFilter)
    return (
      <AvatarGroup max={5} spacing={0}>
        {students &&
          students.map((student, index) => {
            if (
              student?.grade_levels &&
              grades.includes(
                student?.grade_levels[0].grade_level == 'Kin' ? 'Kindergarten' : student?.grade_levels[0].grade_level,
              )
            ) {
              return (
                <Avatar
                  key={index}
                  alt={student.person.first_name || student.person.preferred_first_name}
                  src={getProfilePhoto(student.person)}
                />
              )
            }
          })}
      </AvatarGroup>
    )
  }

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    setSelectedEventIndex(0)
    setSelectedEvent(filteredEvents.at(0))
  }, [events?.length, selectedDate])

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    filteredEvents.forEach((event, index) => {
      if (event.eventId == selectedEventId) {
        setSelectedEventIndex(index)
        setSelectedEvent(filteredEvents.at(index))
      }
    })
  }, [events?.length, selectedEventId])

  return (
    <Stack>
      {selectedEvent && (
        <>
          <Box sx={{ display: 'flex', padding: '10px 0' }}>
            {selectedEvent?.filters?.grades && avatarGroup(selectedEvent?.filters?.grades)}
          </Box>
          <Box>
            <Button sx={{ ...eventDetailClassess.clubButton, background: `${selectedEvent?.eventTypeColor}1A` }}>
              <Subtitle color={selectedEvent?.eventTypeColor} size={12} fontWeight='500'>
                {selectedEvent?.eventTypeName}
              </Subtitle>
            </Button>
          </Box>
          <Subtitle fontWeight='600' sx={{ my: 1.5, fontSize: '16px' }} color={SYSTEM_02}>
            {selectedEvent?.title}
          </Subtitle>
          <Subtitle fontWeight='bold' color={SYSTEM_06} sx={{ display: 'inline-block', fontSize: '12px' }}>
            {renderDate(selectedEvent)}
          </Subtitle>
          <Subtitle fontWeight='bold' color={SYSTEM_06} sx={{ marginTop: 1, fontSize: '12px' }}>
            {renderFilter(selectedEvent)}
          </Subtitle>
          <Box sx={{ height: '100px' }}>
            <Subtitle fontWeight='500' color={SYSTEM_05} sx={{ mt: 2, fontSize: '12px' }}>
              {extractContent(selectedEvent?.description || '')}
            </Subtitle>
          </Box>
          <Box sx={eventDetailClassess.arrowButtonGroup}>
            <Button sx={eventDetailClassess.saveBtn} onClick={() => handleRSVPClick()}>
              RSVP
            </Button>
            <Button
              disableElevation
              variant='contained'
              sx={eventDetailClassess.arrowButton}
              startIcon={<ArrowBackIosNewIcon />}
              onClick={() => handlePrevEventView()}
            ></Button>
            <Button
              disableElevation
              variant='contained'
              sx={eventDetailClassess.arrowButton}
              startIcon={<ArrowForwardIosIcon />}
              onClick={() => handleNextEventView()}
            ></Button>
          </Box>
        </>
      )}
    </Stack>
  )
}

export default EventDetail
