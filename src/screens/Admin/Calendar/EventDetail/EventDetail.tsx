import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import moment from 'moment'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/client'

import { EventDetailProps, EventVM } from '../types'
import { mainClasses } from '../MainComponent/styles'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR, GRADES, MTHGREEN, SYSTEM_02, SYSTEM_05, SYSTEM_06 } from '../../../../utils/constants'
import { deleteEventByIdMutation } from '../services'
import CustomModal from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'

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

const renderDate = (selectedEvent: EventVM | undefined): string => {
  const startTime = moment(selectedEvent?.startDate).format('hh:mm A')
  const startDate = moment(selectedEvent?.startDate).format('MMMM DD')
  const endDate = moment(selectedEvent?.endDate).format('MMMM DD')

  if (!selectedEvent?.allDay) {
    if (startDate === endDate) return `${startTime}, ${startDate}`
    else return `${startTime}, ${startDate} - ${endDate}`
  } else {
    if (startDate === endDate) return `${endDate}`
    else return `${startDate} - ${endDate}`
  }
}

/**
 * @param {(string | number)[]} GRADES
 * @param {EventVM} selectedEvent
 * @description convert 'Kindergarten' to 'K', set dash if the sequence value length > 3
 * @logic divide array into sub arrays with same sub lengths, and set the dash values
 * @example ['kindergarten',1,2,4,7,9,10,11,12] => ['kindergarten,1,2],[4],[7],[9,10,11,12] => k-2,4,7,9-12
 * @return converted string from array
 */
const renderFilter = (selectedEvent: EventVM | undefined): string => {
  if (selectedEvent?.filters?.grades) {
    let grades: any[] = []
    grades = GRADES.map((item) => {
      if (
        JSON.parse(selectedEvent?.filters?.grades)
          .filter((item: string) => item != 'all')
          .includes(`${item}`)
      ) {
        return item
      } else return null
    })
      .filter((item) => item)

    let kIndex = grades.indexOf('Kindergarten');
    if (~kIndex) grades[kIndex] = 0;

    const res = grades?.reduce((seq, v, i, a) => {
      if (i && a[i - 1] !== v - 1) {
        seq.push([]);
      }
      seq[seq.length - 1].push(v);
      return seq;
    }, [[]]).filter(({ length }: { length: any }) => length > 0);

    for (let i = 0; i < res.length; i++) {
      let reverkIndex = res[i].indexOf(0);
      if (~reverkIndex) res[i][reverkIndex] = 'K';

      if (res[i].length > 2) {
        res[i] = res[i][0] + '-' + res[i][res[i].length - 1]
      }
    }

    return res && res.length > 0 && res.join(',')
  }
  return ''
}

const EventDetail = ({ selectedEventIndex, setSelectedEventIndex, events, setEvent, refetch }: EventDetailProps) => {
  const toolTipClass = toolTipStyles()
  const history = useHistory()
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteEventById, { }] = useMutation(deleteEventByIdMutation)
  const [getRenderDate, setGetRenderDate] = useState<String>('')
  const [getRenderFilter, setGetRenderFilter] = useState<String>('')

  useEffect(() => {
    if (selectedEvent) {
      setGetRenderDate(renderDate(selectedEvent))
      setGetRenderFilter(renderFilter(selectedEvent))
    }
  }, [selectedEvent])

  useEffect(() => {
    if (events?.length > 0) {
      if (selectedEventIndex + 1 > events?.length) {
        setSelectedEvent(events[0])
        setSelectedEventIndex(0)
      }
      setSelectedEvent(events[selectedEventIndex])
    } else {
      setSelectedEvent(undefined)
    }
  }, [events])

  const handleRSVPClick = () => {
    history.push(`${CALENDAR}/rsvp`)
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
    if (selectedEventIndex - 1 >= 0) {
      setSelectedEventIndex(selectedEventIndex - 1)
      setSelectedEvent(events?.at(selectedEventIndex - 1))
    }
  }

  const handleNextEventView = () => {
    if (selectedEventIndex + 1 < events?.length) {
      setSelectedEventIndex(selectedEventIndex + 1)
      setSelectedEvent(events?.at(selectedEventIndex + 1))
    }
  }

  return (
    <Stack>
      <Box>
        <Button sx={mainClasses.clubButton}>
          <Subtitle color={MTHGREEN} size={12} fontWeight='500'>
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
      <Subtitle size='medium' fontWeight='500' sx={{ my: 1.5 }} color={SYSTEM_02}>
        {selectedEvent?.title}
      </Subtitle>
      <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ display: 'inline-block' }}>
        {getRenderDate}
      </Subtitle>
      <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ marginTop: 1 }}>
        {getRenderFilter}
      </Subtitle>
      <Subtitle size={12} fontWeight='500' color={SYSTEM_05} sx={{ mt: 2 }}>
        <Typography component={'span'} variant={'body2'} dangerouslySetInnerHTML={{ __html: selectedEvent?.description || '' }} />
      </Subtitle>
      <Box sx={mainClasses.arrowButtonGroup}>
        <Button sx={mainClasses.saveBtn} onClick={() => handleRSVPClick()}>
          RSVP
        </Button>
        <Button disableElevation variant='contained' sx={mainClasses.arrowButton} onClick={() => handlePrevEventView()}>
          <ArrowBackIosNewIcon sx={mainClasses.arrowIconButton} />
        </Button>
        <Button disableElevation variant='contained' sx={mainClasses.arrowButton} onClick={() => handleNextEventView()}>
          <ArrowForwardIosIcon sx={mainClasses.arrowIconButton} />
        </Button>
      </Box>
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