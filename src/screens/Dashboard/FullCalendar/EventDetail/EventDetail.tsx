import { Avatar, AvatarGroup, Box, Button, Stack } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR, GRADES, MTHGREEN, SYSTEM_02, SYSTEM_05, SYSTEM_06 } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import moment from 'moment'
import { useStyles } from './styles'
import { EventDetailProps } from '../types'
import { EventVM } from '../../../Admin/Calendar/types'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Person } from '../../../HomeroomStudentProfile/Student/types'

const EventDetail = ({ selectedEventIndex, selectedEventIds, setSelectedEventIndex, events }: EventDetailProps) => {
  const classes = useStyles
  const history = useHistory()
  const { me } = useContext(UserContext)
  const students = me?.students
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()

  const handleRSVPClick = () => {
    history.push(`${CALENDAR}/rsvp`)
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
  const innerHtml = (value: string) => {
    return { __html: value }
  }

  const getFilteredEvents = () => {
    return selectedEventIds.length > 0
      ? [...events?.filter((event) => selectedEventIds.includes(Number(event.eventId)))]
      : [...events]
  }

  const handlePrevEventView = () => {
    if (selectedEventIndex - 1 >= 0) {
      setSelectedEventIndex(selectedEventIndex - 1)
    }
  }

  const handleNextEventView = () => {
    let filteredEvents = getFilteredEvents()
    if (selectedEventIndex + 1 < filteredEvents?.length) {
      setSelectedEventIndex(selectedEventIndex + 1)
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
                <Avatar key={index} alt={student.person.preferred_first_name} src={getProfilePhoto(student.person)} />
              )
            }
          })}
      </AvatarGroup>
    )
  }

  useEffect(() => {
    if (events.length > 0) {
      const filteredEvents = getFilteredEvents()
      if (filteredEvents?.length > 0) {
        setSelectedEvent(filteredEvents[selectedEventIndex])
      } else {
        setSelectedEvent(undefined)
      }
    }
  }, [events, selectedEventIndex])

  useEffect(() => {
    setSelectedEventIndex(0)
    setSelectedEvent(events?.filter((event) => selectedEventIds.includes(Number(event.eventId))).at(0))
  }, [selectedEventIds])

  return (
    <Stack>
      {selectedEvent && (
        <>
          <Box sx={{ display: 'flex', padding: '10px 0' }}>
            {selectedEvent?.filters?.grades && avatarGroup(selectedEvent?.filters?.grades)}
          </Box>
          <Box>
            <Button sx={classes.clubButton}>
              <Subtitle color={MTHGREEN} size={12} fontWeight='500'>
                {selectedEvent?.eventTypeName}
              </Subtitle>
            </Button>
          </Box>
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
            <div dangerouslySetInnerHTML={innerHtml(selectedEvent?.description || '')}></div>
          </Subtitle>
          <Box sx={classes.arrowButtonGroup}>
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
    </Stack>
  )
}

export default EventDetail
