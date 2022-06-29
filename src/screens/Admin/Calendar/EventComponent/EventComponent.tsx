import { Box, Button, Stack, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR, MTHGREEN, SYSTEM_02, SYSTEM_05, SYSTEM_06 } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { useStyles } from '../MainComponent/styles'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { makeStyles } from '@material-ui/styles'
import { EventComponentProps, EventVM } from '../types'
import moment from 'moment'
import { useMutation } from '@apollo/client'
import { deleteEventByIdMutation } from '../EditTypeComponent/services'
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

const EventComponent = ({ events, setEvent, refetch }: EventComponentProps) => {
  const classes = useStyles
  const toolTipClass = toolTipStyles()
  const history = useHistory()
  const [selectedEvent, setSelectedEvent] = useState<EventVM | undefined>()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteEventById, {}] = useMutation(deleteEventByIdMutation)

  const handleRSVPClick = () => {
    history.push(`${CALENDAR}/rsvp`)
  }

  const renderDate = (): string => {
    return `${moment(selectedEvent?.startDate).format('hh:mm A')}, ${moment(selectedEvent?.startDate).format(
      'MMMM DD',
    )} - ${moment(selectedEvent?.endDate).format('MMMM DD')}`
  }

  const handleDelete = async () => {
    if (selectedEvent?.eventId) {
      await deleteEventById({
        variables: {
          eventId: selectedEvent.eventId,
        },
      })
      refetch()
      setShowDeleteModal(false)
    }
  }
  const renderFilter = (): string => {
    let grades = ''
    if (selectedEvent?.filters?.grades) {
      grades = JSON.parse(selectedEvent?.filters?.grades)
        .filter((item: string) => item != 'all')
        .join(',')
    }
    return grades
  }
  const innerHtml = (value: string) => {
    return { __html: value }
  }

  const handlePrevEventView = () => {
    if (selectedIndex - 1 >= 0) {
      setSelectedIndex(selectedIndex - 1)
      setSelectedEvent(events?.at(selectedIndex - 1))
    }
  }

  const handleNextEventView = () => {
    if (selectedIndex + 1 < events?.length) {
      setSelectedIndex(selectedIndex + 1)
      setSelectedEvent(events?.at(selectedIndex + 1))
    }
  }

  useEffect(() => {
    if (events?.length > 0) {
      setSelectedEvent(events[selectedIndex])
    } else {
      setSelectedEvent(undefined)
    }
  }, [events])

  return (
    <Stack>
      {selectedEvent && (
        <>
          <Box>
            <Button sx={classes.clubButton}>
              <Subtitle color={MTHGREEN} size={12} fontWeight='500'>
                {selectedEvent?.eventTypeName}
              </Subtitle>
            </Button>
            <Button
              sx={{ mt: 1.5, width: 40 }}
              onClick={() => {
                history.push(`${CALENDAR}/addEvent`)
                console.log()
                setEvent(selectedEvent)
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
            <Button sx={{ mt: 1.5, width: 40 }} onClick={() => setShowDeleteModal(true)}>
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
            {renderDate()}
          </Subtitle>
          <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ marginTop: 1 }}>
            {renderFilter()}
          </Subtitle>
          <Subtitle size={12} fontWeight='500' color={SYSTEM_05} sx={{ mt: 2 }}>
            <div dangerouslySetInnerHTML={innerHtml(selectedEvent?.description || '')}></div>
          </Subtitle>
        </>
      )}
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

export default EventComponent
