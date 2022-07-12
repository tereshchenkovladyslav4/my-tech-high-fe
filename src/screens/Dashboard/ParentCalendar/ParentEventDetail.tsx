import React, { FunctionComponent } from 'react'
import { Box, Button } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import moment from 'moment'
import { useStyles } from './styles'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { EventVM } from '../../Admin/Calendar/types'
import { MTHGREEN, SYSTEM_05, SYSTEM_02, SYSTEM_06, GRADES } from '../../../utils/constants'
import { extractContent } from '../../../utils/utils'
type ParentEventDetailProps = {
  selectedEvent: EventVM | undefined
  setSectionName: (value: string) => void
  handleRSVPClick: () => void
  handlePrevEventView: () => void
  handleNextEventView: () => void
}
export const ParentEventDetail: FunctionComponent<ParentEventDetailProps> = ({
  selectedEvent,
  setSectionName,
  handleRSVPClick,
  handlePrevEventView,
  handleNextEventView,
}) => {
  const classes = useStyles
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

  return (
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
        {extractContent(selectedEvent?.description || '')}
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
  )
}
