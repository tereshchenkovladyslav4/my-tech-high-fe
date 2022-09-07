import React, { useContext, ReactElement } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Avatar, AvatarGroup, Box, Button } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { extractContent, getProfilePhoto, hexToRgbA, renderDate, renderFilter } from '@mth/utils'
import { parentCalendarClasses } from './styles'
import { ParentEventDetailProps } from './types'

export const ParentEventDetail: React.FC<ParentEventDetailProps> = ({
  selectedEvent,
  setSectionName,
  handleRSVPClick,
  handlePrevEventView,
  handleNextEventView,
}) => {
  const { me } = useContext(UserContext)
  const students = me?.students
  const avatarGroup = (gradeFilter: string) => {
    const grades = JSON.parse(gradeFilter)
    return (
      <AvatarGroup max={3} spacing={0}>
        {students &&
          students
            .filter((student) => student?.status?.at(-1)?.status != 2)
            .map((student, index): ReactElement | undefined => {
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
              } else return undefined
            })}
      </AvatarGroup>
    )
  }
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          sx={{ ...parentCalendarClasses.clubButton, backgroundColor: hexToRgbA(selectedEvent?.eventTypeColor || '') }}
        >
          <Subtitle color={selectedEvent?.eventTypeColor} size={19} fontWeight='500'>
            {selectedEvent?.eventTypeName}
          </Subtitle>
        </Button>
        <Box sx={{ display: { md: 'none', sm: 'flex', xs: 'flex' }, paddingX: 5 }}>
          {selectedEvent?.filters?.grades && avatarGroup(selectedEvent?.filters?.grades)}
        </Box>
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
      <Box sx={{ height: '80px' }} display={{ md: 'block', sm: 'none', xs: 'none' }}>
        <Subtitle fontWeight='500' color={MthColor.SYSTEM_05} sx={{ mt: 2, fontSize: '12px' }}>
          {extractContent(selectedEvent?.description || '')?.substring(0, 150)}...
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
      <Box sx={{ height: '80px' }} display={{ md: 'none', sm: 'block', xs: 'block' }}>
        <Subtitle fontWeight='500' color={MthColor.SYSTEM_05} sx={{ mt: 2, fontSize: '12px' }}>
          {extractContent(selectedEvent?.description || '')}
        </Subtitle>
      </Box>
      <Box marginTop={4} display={{ xs: 'none', sm: 'none', md: 'flex' }}>
        {selectedEvent?.hasRSVP && (
          <Button sx={parentCalendarClasses.saveBtn} onClick={() => handleRSVPClick()}>
            RSVP
          </Button>
        )}
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
      <Box marginTop={2} display={{ xs: 'block', sm: 'block', md: 'none' }}>
        {selectedEvent?.hasRSVP && (
          <Button sx={{ ...parentCalendarClasses.saveBtn, width: '100%' }} onClick={() => handleRSVPClick()}>
            RSVP
          </Button>
        )}
      </Box>
    </>
  )
}
