import React from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Button } from '@mui/material'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_05, SYSTEM_02, SYSTEM_06 } from '../../../utils/constants'
import { extractContent, hexToRgbA, renderDate, renderFilter } from '../../../utils/utils'
import { parentCalendarClasses } from './styles'
import { ParentEventDetailTemplateType } from './types'

export const ParentEventDetail: ParentEventDetailTemplateType = ({
  selectedEvent,
  setSectionName,
  handleRSVPClick,
  handlePrevEventView,
  handleNextEventView,
}) => {
  return (
    <>
      <Button
        sx={{ ...parentCalendarClasses.clubButton, backgroundColor: hexToRgbA(selectedEvent?.eventTypeColor || '') }}
      >
        <Subtitle color={selectedEvent?.eventTypeColor} size={19} fontWeight='500'>
          {selectedEvent?.eventTypeName}
        </Subtitle>
      </Button>
      <Subtitle fontWeight='600' sx={{ my: 1.5, fontSize: '16px' }} color={SYSTEM_02}>
        {selectedEvent?.title}
      </Subtitle>
      <Subtitle fontWeight='bold' color={SYSTEM_06} sx={{ display: 'inline-block', fontSize: '12px' }}>
        {renderDate(selectedEvent)}
      </Subtitle>
      <Subtitle fontWeight='bold' color={SYSTEM_06} sx={{ marginTop: 1, fontSize: '12px' }}>
        {renderFilter(selectedEvent)}
      </Subtitle>
      <Box sx={{ height: '80px' }}>
        <Subtitle fontWeight='500' color={SYSTEM_05} sx={{ mt: 2, fontSize: '12px' }}>
          {extractContent(selectedEvent?.description || '').substring(0, 150)}...
          <a
            style={parentCalendarClasses.readMore}
            onClick={() => {
              setSectionName('fullCalendar')
            }}
          >
            Read More
          </a>
        </Subtitle>
      </Box>
      <Box sx={parentCalendarClasses.arrowButtonGroup} display={{ xs: 'none', sm: 'flex' }}>
        <Button sx={parentCalendarClasses.saveBtn} onClick={() => handleRSVPClick()}>
          RSVP
        </Button>
        <Button
          disableElevation
          variant='contained'
          sx={parentCalendarClasses.arrowButton}
          startIcon={<ArrowBackIosNewIcon sx={{ padding: '2px', minWidth: 'fit-content' }} />}
          onClick={() => handlePrevEventView()}
        ></Button>
        <Button
          disableElevation
          variant='contained'
          sx={parentCalendarClasses.arrowButton}
          startIcon={<ArrowForwardIosIcon sx={{ padding: '2px', minWidth: 'fit-content' }} />}
          onClick={() => handleNextEventView()}
        ></Button>
      </Box>
    </>
  )
}
