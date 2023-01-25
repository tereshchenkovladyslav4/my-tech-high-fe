import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Avatar, AvatarGroup, Box, Button, Stack } from '@mui/material'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthRoute } from '@mth/enums'
import { SchedulePeriod } from '@mth/graphql/models/schedule-period'
import { Student } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import {
  extractContent,
  getFirstDayAndLastDayOfMonth,
  getProfilePhoto,
  hexToRgbA,
  renderDate,
  renderFilter,
} from '@mth/utils'
import { getSchedulePeriodByProviderIds } from '../../services'
import { EventDetailProps } from '../types'
import { eventDetailClassess } from './styles'

const EventDetail: React.FC<EventDetailProps> = ({
  events,
  selectedEventIndex,
  selectedDate,
  selectedEventId,
  selectedEvent,
  currentMonth,
  setSelectedEventIndex,
  setSelectedEvent,
}) => {
  const history = useHistory()
  const { me } = useContext(UserContext)
  const students = me?.students
  const [firstDay, setFirstDay] = useState<Date>()
  const [lastDay, setLastDay] = useState<Date>()
  const [scheduleIds, setScheduleIds] = useState<number[]>()
  const { data: studentSchedulePeriodsData, refetch } = useQuery(getSchedulePeriodByProviderIds, {
    variables: {
      providerIds: selectedEvent?.filters?.provider,
    },
    skip: !selectedEvent?.filters?.provider,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!studentSchedulePeriodsData) {
      refetch()
    } else {
      const periodsProvider: number[] = []
      studentSchedulePeriodsData.schedulePeriodsByProvider.map((obj: SchedulePeriod) => {
        if (!periodsProvider.includes(obj.ScheduleId) && obj.ScheduleId) {
          periodsProvider.push(obj.ScheduleId)
        }
      })
      setScheduleIds(periodsProvider)
    }
  }, [studentSchedulePeriodsData])
  const handleRSVPClick = () => {
    history.push(`${MthRoute.CALENDAR}/rsvp`)
  }

  const getFilteredEvents = (selectedDate: Date | undefined) => {
    return !!selectedDate
      ? events?.filter(
          (event) =>
            moment(event.startDate).format('YYYY-MM-DD') <= moment(selectedDate).format('YYYY-MM-DD') &&
            moment(event.endDate).format('YYYY-MM-DD') >= moment(selectedDate).format('YYYY-MM-DD'),
        )
      : events.filter(
          (event) =>
            (moment(firstDay).format('YYYY-MM-DD') <= moment(event.startDate).format('YYYY-MM-DD') &&
              moment(lastDay).format('YYYY-MM-DD') >= moment(event.startDate).format('YYYY-MM-DD')) ||
            (moment(firstDay).format('YYYY-MM-DD') <= moment(event.endDate).format('YYYY-MM-DD') &&
              moment(lastDay).format('YYYY-MM-DD') >= moment(event.endDate).format('YYYY-MM-DD')),
        )
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

  const avatarGroup = (gradeFilter: string, providerFilter: string) => {
    const grades = JSON.parse(gradeFilter)
    const providers = JSON.parse(providerFilter)
    let filteredStudents =
      students &&
      students
        .filter((student) => student?.status?.at(-1)?.status != 2)
        .filter(
          (student: Student) =>
            student?.grade_levels &&
            grades.includes(
              student?.grade_levels[0].grade_level == 'Kin' ? 'Kindergarten' : student?.grade_levels[0].grade_level,
            ),
        )
    if (providers && providers.length > 0) {
      filteredStudents = filteredStudents
        ?.filter((student) => student.StudentSchedules && student.StudentSchedules.length > 0)
        ?.filter((obj) => {
          const newStudents = obj?.StudentSchedules?.filter((schedule) =>
            scheduleIds?.some((sid) => {
              return +schedule.schedule_id === +sid
            }),
          )
          return newStudents && newStudents?.length > 0
        })
    }
    return (
      <AvatarGroup max={5} spacing={0}>
        {filteredStudents?.map((student, index): ReactElement | undefined => {
          return (
            <Avatar
              key={index}
              alt={student.person.first_name || student.person.preferred_first_name}
              src={getProfilePhoto(student.person)}
            />
          )
        })}
      </AvatarGroup>
    )
  }

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    setSelectedEventIndex(0)
    setSelectedEvent(filteredEvents.at(0))
  }, [events?.length, selectedDate, firstDay])

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    filteredEvents.forEach((event, index) => {
      if (event.eventId == selectedEventId) {
        setSelectedEventIndex(index)
        setSelectedEvent(filteredEvents.at(index))
      }
    })
  }, [events?.length, selectedEventId])

  useEffect(() => {
    const { firstDay: first, lastDay: last } = getFirstDayAndLastDayOfMonth(currentMonth)
    setFirstDay(first)
    setLastDay(last)
  }, [currentMonth])

  return (
    <Stack>
      {selectedEvent && (
        <>
          <Box sx={{ display: 'flex', padding: '10px 0' }}>
            {selectedEvent?.filters?.grades &&
              avatarGroup(selectedEvent?.filters?.grades, selectedEvent?.filters?.provider)}
          </Box>
          <Box>
            <Button
              sx={{ ...eventDetailClassess.clubButton, background: hexToRgbA(selectedEvent?.eventTypeColor || '') }}
            >
              <Subtitle color={selectedEvent?.eventTypeColor} sx={{ fontSize: '12px', fontWeight: '500' }}>
                {selectedEvent?.eventTypeName}
              </Subtitle>
            </Button>
          </Box>
          <Subtitle fontWeight='600' sx={{ my: 1.5, fontSize: '16px' }} color={MthColor.SYSTEM_02}>
            {selectedEvent?.title}
          </Subtitle>
          <Subtitle fontWeight='bold' color={MthColor.SYSTEM_06} sx={{ display: 'inline-block', fontSize: '12px' }}>
            {renderDate(selectedEvent)}
          </Subtitle>
          <Subtitle fontWeight='bold' color={MthColor.SYSTEM_06} sx={{ marginTop: 1, fontSize: '12px' }}>
            {renderFilter(selectedEvent)}
          </Subtitle>
          <Box sx={{ height: '100px' }}>
            <Subtitle fontWeight='500' color={MthColor.SYSTEM_05} sx={{ mt: 2, fontSize: '12px' }}>
              {extractContent(selectedEvent?.description || '')}
            </Subtitle>
          </Box>
          <Box sx={eventDetailClassess.arrowButtonGroup}>
            {selectedEvent?.hasRSVP && (
              <Button sx={eventDetailClassess.saveBtn} onClick={() => handleRSVPClick()}>
                RSVP
              </Button>
            )}
            <Button
              disableElevation
              variant='contained'
              sx={eventDetailClassess.arrowButton}
              startIcon={<ArrowBackIosNewIcon sx={{ padding: '2px', minWidth: 'fit-content' }} />}
              onClick={() => handlePrevEventView()}
            ></Button>
            <Button
              disableElevation
              variant='contained'
              sx={eventDetailClassess.arrowButton}
              startIcon={<ArrowForwardIosIcon sx={{ padding: '2px', minWidth: 'fit-content' }} />}
              onClick={() => handleNextEventView()}
            ></Button>
          </Box>
        </>
      )}
    </Stack>
  )
}

export default EventDetail
