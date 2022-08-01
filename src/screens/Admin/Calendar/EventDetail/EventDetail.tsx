import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import { EventDetailProps } from '../types'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR, SYSTEM_02, SYSTEM_05, SYSTEM_06 } from '../../../../utils/constants'
import { deleteEventByIdMutation } from '../services'
import CustomModal from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { getFirstDayAndLastDayOfMonth, hexToRgbA, renderDate, renderFilter } from '../../../../utils/utils'
import { mainClasses } from '../MainComponent/styles'

const toolTipStyles = makeStyles(() => ({
  customTooltip: {
    backgroundColor: '#767676',
    fontSize: '14px',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 9,
    paddingBottom: 9,
  },
}))

const EventDetail = ({
  events,
  selectedEventIndex,
  selectedDate,
  selectedEventId,
  selectedEvent,
  currentMonth,
  setSelectedEvent,
  setSelectedEventIndex,
  setEvent,
  refetch,
}: EventDetailProps) => {
  const toolTipClass = toolTipStyles()
  const history = useHistory()
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteEventById, {}] = useMutation(deleteEventByIdMutation)
  const [firstDay, setFirstDay] = useState<Date>()
  const [lastDay, setLastDay] = useState<Date>()

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
      : events.filter(
          (event) =>
            (moment(firstDay).format('YYYY-MM-DD') <= moment(event.startDate).format('YYYY-MM-DD') &&
              moment(lastDay).format('YYYY-MM-DD') >= moment(event.startDate).format('YYYY-MM-DD')) ||
            (moment(firstDay).format('YYYY-MM-DD') <= moment(event.endDate).format('YYYY-MM-DD') &&
              moment(lastDay).format('YYYY-MM-DD') >= moment(event.endDate).format('YYYY-MM-DD')),
        )
  }

  const handleDelete = async () => {
    if (selectedEvent?.eventId) {
      await deleteEventById({
        variables: {
          eventId: Number(selectedEvent.eventId),
        },
      })
      refetch()
      setShowDeleteModal(false)
    }
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

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    setSelectedEventIndex(0)
    setSelectedEvent(filteredEvents.at(0))
  }, [events?.length, selectedDate, firstDay])

  useEffect(() => {
    const filteredEvents = getFilteredEvents(selectedDate)
    filteredEvents.forEach((event, index) => {
      if (Number(event.eventId) == Number(selectedEventId)) {
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
          <Box>
            <Button sx={{ ...mainClasses.clubButton, background: hexToRgbA(selectedEvent?.eventTypeColor || '') }}>
              <Subtitle color={selectedEvent?.eventTypeColor} sx={{ fontSize: '12px', fontWeight: '500' }}>
                {selectedEvent?.eventTypeName}
              </Subtitle>
            </Button>
            <Button
              sx={mainClasses.iconButton}
              onClick={() => {
                history.push(`${CALENDAR}/addEvent`)
                selectedEvent && setEvent(selectedEvent)
              }}
            >
              <Tooltip
                title='Edit'
                placement='top'
                classes={{
                  tooltip: toolTipClass.customTooltip,
                }}
              >
                <ModeEditIcon />
              </Tooltip>
            </Button>
            <Button sx={mainClasses.iconButton} onClick={() => setShowDeleteModal(true)}>
              <Tooltip
                title='Delete'
                placement='top'
                classes={{
                  tooltip: toolTipClass.customTooltip,
                }}
              >
                <DeleteForeverOutlinedIcon />
              </Tooltip>
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
          <Subtitle fontWeight='500' color={SYSTEM_05} sx={{ mt: 2, fontSize: '12px' }}>
            <Typography
              component={'span'}
              variant={'body2'}
              dangerouslySetInnerHTML={{ __html: selectedEvent?.description || '' }}
            />
          </Subtitle>
          <Box sx={mainClasses.arrowButtonGroup}>
            <Button sx={mainClasses.saveBtn} onClick={() => handleRSVPClick()}>
              RSVP
            </Button>
            <Button
              disableElevation
              variant='contained'
              sx={mainClasses.arrowButton}
              onClick={() => handlePrevEventView()}
            >
              <ArrowBackIosNewIcon sx={mainClasses.arrowIconButton} />
            </Button>
            <Button
              disableElevation
              variant='contained'
              sx={mainClasses.arrowButton}
              onClick={() => handleNextEventView()}
            >
              <ArrowForwardIosIcon sx={mainClasses.arrowIconButton} />
            </Button>
          </Box>
        </>
      )}
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this event?'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleDelete()
          }}
        />
      )}
    </Stack>
  )
}

export default EventDetail
